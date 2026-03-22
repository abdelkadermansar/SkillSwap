'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Récupérer l'URL de redirection depuis l'URL ou sessionStorage
  const callbackUrl = searchParams.get('callbackUrl') || 
                      sessionStorage.getItem('redirectAfterLogin') || 
                      '/';
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Nettoyer le stockage après utilisation
  if (callbackUrl !== '/' && sessionStorage.getItem('redirectAfterLogin')) {
    sessionStorage.removeItem('redirectAfterLogin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast.success('Connexion réussie !');
      router.push(callbackUrl);
    } else {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          required
        />
        
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
        />
      </div>
      
      {/* Lien Mot de passe oublié */}
      <div className="text-right">
        <Link 
          href="/forgot-password" 
          className="text-sm text-purple-600 hover:text-purple-500 hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      
      <Button type="submit" loading={isLoading} className="w-full">
        Se connecter
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à SkillSwap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
              créez un compte gratuitement
            </Link>
          </p>
        </div>
        
        <Suspense fallback={<div>Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}