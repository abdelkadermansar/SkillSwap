'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Le hook useAuth gère déjà l'état d'authentification
  // Pas besoin de SessionProvider
  return <>{children}</>;
}
