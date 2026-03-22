'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Conversation {
  _id: string;
  participants: Array<{ _id: string; name: string; avatar: string }>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>; // Changé de Map à Record
}

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchConversations();
    }
  }, [authLoading, isAuthenticated]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations);
      }
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== user?.id);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    if (diff < 7) return `Il y a ${diff} jours`;
    return d.toLocaleDateString('fr-FR');
  };

  // Obtenir le nombre de messages non lus
  const getUnreadCount = (conversation: Conversation) => {
    if (!user?.id) return 0;
    // unreadCount est un objet, pas une Map
    return conversation.unreadCount?.[user.id] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">Aucune conversation</p>
            <Link href="/explore" className="text-purple-600 hover:underline">
              Explorer les annonces
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const unread = getUnreadCount(conv);
              
              return (
                <Link
                  key={conv._id}
                  href={`/messages/${conv._id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">
                        {other?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {other?.name || 'Utilisateur'}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatDate(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage || 'Nouvelle conversation'}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {unread}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
