'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user, isAuthenticated } = useAuth();
  const lastCheckRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessagesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkNewMessages = async () => {
      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
        
        if (response.ok && data.conversations) {
          for (const conv of data.conversations) {
            const unreadCount = conv.unreadCount?.[user.id] || 0;
            const lastMessageTime = new Date(conv.lastMessageAt).getTime();
            const lastChecked = lastMessagesRef.current.get(conv._id) || 0;
            
            if (unreadCount > 0 && lastMessageTime > lastChecked && lastMessageTime > lastCheckRef.current) {
              const other = conv.participants.find((p: any) => p._id !== user.id);
              
              toast.info(`📩 Nouveau message de ${other?.name}`, {
                description: conv.lastMessage?.substring(0, 100),
                duration: 5000,
                action: {
                  label: 'Voir',
                  onClick: () => window.location.href = `/messages/${conv._id}`
                }
              });
            }
            lastMessagesRef.current.set(conv._id, lastMessageTime);
          }
        }
        lastCheckRef.current = Date.now();
      } catch (error) {
        console.error('Erreur check messages:', error);
      }
    };

    intervalRef.current = setInterval(checkNewMessages, 5000);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, user]);
}
