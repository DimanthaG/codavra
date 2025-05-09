'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';

interface Participant {
  name: string;
  email: string;
  image: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  created_by: string;
  created_by_name: string;
  created_by_image: string;
  allow_join: boolean;
  participants: Participant[];
}

export default function MeetingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasAutoJoined, setHasAutoJoined] = useState(false);

  const fetchMeeting = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching meeting:', error);
        return;
      }

      setMeeting(data);
    } catch (error) {
      console.error('Error fetching meeting:', error);
    }
  }, [params.id]);

  // Initial fetch
  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  // Handle auto-join
  useEffect(() => {
    const autoJoin = searchParams.get('autoJoin');
    if (
      autoJoin === 'true' && 
      session?.user && 
      meeting && 
      !isJoining && 
      !hasAutoJoined &&
      !meeting.participants?.some(p => p.email === session.user.email)
    ) {
      setHasAutoJoined(true);
      handleJoin();
    }
  }, [session, meeting, searchParams, hasAutoJoined]);

  const handleJoin = async () => {
    if (!session?.user?.name || !session?.user?.email || !session?.user?.image || !meeting) return;

    setIsJoining(true);
    try {
      // First fetch latest meeting data to ensure we have current participants
      const { data: latestMeeting, error: fetchError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meeting.id)
        .single();

      if (fetchError) {
        console.error('Error fetching latest meeting:', fetchError);
        throw fetchError;
      }

      console.log('Latest meeting data:', latestMeeting);

      const newParticipant: Participant = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image?.split('=')[0] + '=s400-c' || ''
      };

      console.log('New participant:', newParticipant);

      // Ensure participants is always an array
      const currentParticipants = Array.isArray(latestMeeting.participants) ? latestMeeting.participants : [];
      console.log('Current participants:', currentParticipants);

      // Create new participants array
      const updatedParticipants = [
        ...currentParticipants.filter((p: Participant) => p.email !== newParticipant.email),
        newParticipant
      ];

      console.log('Updated participants array:', updatedParticipants);

      // Update the meeting with new participants array
      const { data: updateData, error } = await supabase
        .from('meetings')
        .update({ 
          participants: updatedParticipants 
        })
        .eq('id', meeting.id)
        .select();

      if (error) {
        console.error('Error updating participants:', error);
        throw error;
      }

      console.log('Update response:', updateData);

      if (!updateData) {
        throw new Error('No data returned from update');
      }

      // Update local state with complete latest meeting data
      setMeeting({
        ...latestMeeting,
        participants: updatedParticipants
      });

      // Verify the update by fetching again
      const { data: verifyData, error: verifyError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meeting.id)
        .single();

      if (verifyError) {
        console.error('Error verifying update:', verifyError);
      } else {
        console.log('Verified meeting data:', verifyData);
      }

    } catch (error) {
      console.error('Error joining meeting:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSignIn = () => {
    const callbackUrl = `${window.location.origin}/meeting/${params.id}?autoJoin=true`;
    signIn('google', { callbackUrl });
  };

  const formattedDate = new Date(meeting?.date || '').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isParticipant = session?.user?.email && 
    meeting?.participants?.some(p => p.email === session.user.email);

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {meeting ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl"
        >
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold text-white">{meeting.title}</h1>
            <WhatsAppShareButton 
              meetingId={meeting.id} 
              title={meeting.title} 
              description={meeting.description} 
            />
          </div>

          <div className="space-y-6 text-white">
            <div>
              <h2 className="text-xl font-semibold mb-2">When</h2>
              <p className="text-white/80">
                {formattedDate} at {meeting.time}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-white/80 whitespace-pre-wrap">{meeting.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Organizer</h2>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <img
                  src={meeting.created_by_image}
                  alt={meeting.created_by_name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                  }}
                />
                <span className="text-white/90">{meeting.created_by_name}</span>
              </div>
            </div>

            {meeting.allow_join && (
              <div className="pt-6">
                {!session ? (
                  <button
                    onClick={handleSignIn}
                    className="block w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
                  >
                    Sign in to Join
                  </button>
                ) : !isParticipant ? (
                  <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isJoining ? 'Joining...' : 'Join'}
                  </button>
                ) : (
                  <div className="w-full bg-green-500/20 text-green-500 py-3 px-6 rounded-lg font-medium text-center">
                    You've Joined
                  </div>
                )}
              </div>
            )}

            {meeting.participants?.length > 0 && (
              <div className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Participants</h2>
                <div className="grid gap-3">
                  {meeting.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <img
                        src={participant.image}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                        }}
                      />
                      <span className="text-white/90">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
} 