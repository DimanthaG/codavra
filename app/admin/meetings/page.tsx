'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

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
  allow_join: boolean;
  participants: Participant[];
}

export default function AdminMeetings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push('/meeting/create');
      return;
    }

    // Test Supabase permissions
    testDeletePermissions();
    fetchMeetings();
  }, [session, status, router]);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Attempting to delete meeting with ID:', id);
      
      // Skip all permission checks and just delete the meeting
      const { data, error } = await supabase
        .rpc('force_delete_meeting', { meeting_id: id });

      // Log the response for debugging
      console.log('Delete response:', data, error);
      
      if (error) {
        console.error('Delete error:', error);
        alert(`Error: ${error.message}`);
        return;
      }
      
      if (data && data.success) {
        // Update UI on success
        setMeetings(meetings.filter(meeting => meeting.id !== id));
      } else {
        // Show reason for failure
        const reason = data?.reason || 'Unknown reason';
        alert(`Could not delete meeting: ${reason}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdate = async (meeting: Meeting) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          title: meeting.title,
          description: meeting.description,
          date: meeting.date,
          time: meeting.time,
          allow_join: meeting.allow_join,
          participants: meeting.participants || []
        })
        .eq('id', meeting.id)
        .select();

      if (error) {
        console.error('Error updating meeting:', error);
        throw error;
      }

      setMeetings(meetings.map(m => m.id === meeting.id ? meeting : m));
      setEditingMeeting(null);
    } catch (error) {
      console.error('Error updating meeting:', error);
    }
  };

  // Add this new function to test permissions
  const testDeletePermissions = async () => {
    try {
      console.log('Admin email from env:', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      console.log('Current user email:', session?.user?.email);
      
      // Try to get the authenticated user's JWT claims
      const {
        data: { session: authSession },
      } = await supabase.auth.getSession();
      
      console.log('Auth session:', authSession?.user?.email);
      console.log('JWT:', authSession?.access_token);
      
      // Try a select with auth
      const { data: testData, error: testError } = await supabase
        .from('meetings')
        .select('id')
        .limit(1);
        
      console.log('Test select data:', testData);
      console.log('Test select error:', testError);
    } catch (error) {
      console.error('Error testing permissions:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Meetings</h1>
          <button
            onClick={() => router.push('/meeting/create')}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Back to Create
          </button>
        </div>

        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20"
            >
              {editingMeeting?.id === meeting.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                  <textarea
                    value={editingMeeting.description}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    rows={4}
                  />
                  <input
                    type="date"
                    value={editingMeeting.date}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                  <input
                    type="time"
                    value={editingMeeting.time}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingMeeting.allow_join}
                      onChange={(e) => setEditingMeeting({ ...editingMeeting, allow_join: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-white/20"
                    />
                    <label className="ml-2 block text-sm font-medium text-white">
                      Allow participants to join
                    </label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingMeeting(null)}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(editingMeeting)}
                      className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{meeting.title}</h2>
                    <p className="text-white/80 mb-4">{meeting.description}</p>
                    <div className="text-sm text-white/60">
                      <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
                      <p>Time: {meeting.time}</p>
                      <p>Created by: {meeting.created_by}</p>
                      <p className="mt-2">Allow Join: {meeting.allow_join ? 'Yes' : 'No'}</p>
                    </div>

                    {meeting.participants?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Participants</h3>
                        <div className="space-y-2">
                          {meeting.participants.map((participant, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img
                                src={participant.image}
                                alt={participant.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-white">{participant.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/meeting/${meeting.id}`)}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditingMeeting(meeting)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 