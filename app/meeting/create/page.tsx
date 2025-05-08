'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateMeeting() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    allow_join: false
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      // Ensure we have the latest session data
      if (!session?.user?.email || !session?.user?.name || !session?.user?.image) {
        throw new Error('Missing user data');
      }

      const { data, error } = await supabase
        .from('meetings')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            created_by: session.user.email,
            created_by_name: session.user.name,
            created_by_image: session.user.image?.split('=')[0] + '=s400-c' || '',
            allow_join: formData.allow_join,
            participants: []
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating meeting:', error);
        throw error;
      }

      if (data) {
        setIsRedirecting(true);
        // Wait for fade out animation
        setTimeout(() => {
          router.push(`/meeting/${data.id}`, { scroll: false });
        }, 300);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {status !== 'loading' && (
        <>
          <div className="absolute top-4 right-4 flex gap-4">
            {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <button
                onClick={() => router.push('/admin/meetings')}
                className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Logout
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isRedirecting ? 0 : 1,
              y: isRedirecting ? 20 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl"
          >
            <h1 className="text-3xl font-bold text-center text-white mb-8">Create Meeting</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-white mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allow_join"
                  checked={formData.allow_join}
                  onChange={(e) => setFormData({ ...formData, allow_join: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-white/20"
                />
                <label htmlFor="allow_join" className="ml-2 block text-sm font-medium text-white">
                  Allow participants to join this meeting
                </label>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Meeting'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
} 