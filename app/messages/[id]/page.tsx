'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Message {
  _id: string;
  content: string;
  senderId: { _id: string; name: string; avatar: string };
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  participants: Array<{ _id: string; name: string; avatar: string }>;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      setConversationId(params.id as string);
    }
  }, [params]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && conversationId) {
      fetchMessages();
      fetchConversation();
      
      // Rafraîchir les messages toutes les 3 secondes
      const interval = setInterval(() => {
        fetchMessages();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [authLoading, isAuthenticated, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erreur fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      if (response.ok) {
        const conv = data.conversations.find((c: Conversation) => c._id === conversationId);
        setConversation(conv || null);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content: newMessage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        // Forcer un rafraîchissement immédiat
        setTimeout(() => fetchMessages(), 500);
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    if (!conversation || !user) return null;
    return conversation.participants.find(p => p._id !== user.id);
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

  const other = getOtherParticipant();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow p-4 flex items-center gap-3">
          <Link href="/messages" className="text-purple-600 hover:text-purple-700">
            ← Retour
          </Link>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-bold">
              {other?.name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{other?.name}</h2>
            <p className="text-xs text-gray-500">En ligne</p>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 bg-white p-4 overflow-y-auto" style={{ minHeight: '400px', maxHeight: '500px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>Aucun message</p>
              <p className="text-sm">Soyez le premier à envoyer un message</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.senderId._id === user?.id;
                return (
                  <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwn ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2`}>
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className={`text-xs ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isOwn && msg.read && (
                          <span className="text-xs text-purple-200">✓✓</span>
                        )}
                        {isOwn && !msg.read && (
                          <span className="text-xs text-purple-200">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input */}
        <form onSubmit={sendMessage} className="bg-white rounded-b-lg shadow p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <Button type="submit" loading={sending} disabled={!newMessage.trim()}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  );
}
