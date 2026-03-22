'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function NotificationsWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const lastCheckRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessagesRef = useRef<Map<string, number>>(new Map());

  const checkNewMessages = async () => {
    if (!isAuthenticated || !user) return;

    console.log('🔔 Vérification des messages...', new Date().toLocaleTimeString());

    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      
      console.log('🔔 Conversations reçues:', data.conversations?.length || 0);
      
      if (response.ok && data.conversations) {
        for (const conv of data.conversations) {
          const unreadCount = conv.unreadCount?.[user.id] || 0;
          const lastMessageTime = new Date(conv.lastMessageAt).getTime();
          
          console.log(`🔔 Conversation avec ${conv.participants.find((p: any) => p._id !== user.id)?.name}: non lus = ${unreadCount}`);
          
          // Vérifier si c'est un nouveau message non lu
          const lastChecked = lastMessagesRef.current.get(conv._id) || 0;
          
          if (unreadCount > 0 && lastMessageTime > lastChecked && lastMessageTime > lastCheckRef.current) {
            const other = conv.participants.find((p: any) => p._id !== user.id);
            
            console.log('🔔 NOUVEAU MESSAGE!', other?.name, conv.lastMessage);
            
            // Afficher la notification
            toast.info(`📩 Nouveau message de ${other?.name}`, {
              description: conv.lastMessage?.substring(0, 100) || 'Nouveau message',
              duration: 5000,
              action: {
                label: 'Voir',
                onClick: () => {
                  window.location.href = `/messages/${conv._id}`;
                }
              },
              icon: '💬'
            });
            
            // Jouer un son si disponible
            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {});
            } catch (e) {
              // Ignorer les erreurs audio
            }
          }
          
          // Mettre à jour le dernier message connu
          lastMessagesRef.current.set(conv._id, lastMessageTime);
        }
      }
      lastCheckRef.current = Date.now();
    } catch (error) {
      console.error('Erreur check messages:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔔 Notifications activées pour', user.name);
      
      // Vérifier toutes les 5 secondes
      intervalRef.current = setInterval(checkNewMessages, 5000);
      
      // Notification de bienvenue
      toast.success(`Bienvenue ${user.name} !`, {
        description: 'Prêt à échanger des compétences ?',
        duration: 3000,
      });
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
}