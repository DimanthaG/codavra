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
    <div className="min-h-screen p-2 sm:p-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Manage Meetings</h1>
          <button
            onClick={() => router.push('/meeting/create')}
            className="w-full sm:w-auto px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
          >
            Back to Create
          </button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-white/20"
            >
              {editingMeeting?.id === meeting.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base"
                  />
                  <textarea
                    value={editingMeeting.description}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base"
                    rows={4}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={editingMeeting.date}
                      onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base"
                    />
                    <input
                      type="time"
                      value={editingMeeting.time}
                      onChange={(e) => setEditingMeeting({ ...editingMeeting, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm sm:text-base"
                    />
                  </div>
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
                      className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(editingMeeting)}
                      className="px-3 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors text-sm sm:text-base"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{meeting.title}</h2>
                      <p className="text-white/80 mb-3 text-sm sm:text-base">{meeting.description}</p>
                      <div className="text-xs sm:text-sm text-white/60">
                        <p>Date: {new Date(meeting.date).toLocaleDateString()}</p>
                        <p>Time: {meeting.time}</p>
                        <p>Created by: {meeting.created_by}</p>
                        <p className="mt-1">Allow Join: {meeting.allow_join ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <button
                        onClick={() => router.push(`/meeting/${meeting.id}`)}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs sm:text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditingMeeting(meeting)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this meeting?')) {
                            handleDelete(meeting.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600/80 text-white rounded hover:bg-red-700 transition-colors text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {meeting.participants?.length > 0 && (
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                        Participants ({meeting.participants.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {meeting.participants.map((participant, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                            <img
                              src={participant.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                              alt={participant.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                              }}
                            />
                            <div className="overflow-hidden">
                              <p className="text-white text-xs sm:text-sm truncate">{participant.name}</p>
                              <p className="text-white/60 text-xs truncate">{participant.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {meetings.length === 0 && (
            <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-white/20 text-center">
              <p className="text-white text-sm sm:text-base">No meetings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 