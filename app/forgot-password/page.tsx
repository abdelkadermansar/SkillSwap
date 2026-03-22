'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
            <p className="text-gray-600 mb-6">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            
            {sent ? (
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <p className="text-green-600 mb-4">
                  Un email de réinitialisation a été envoyé à <strong>{email}</strong>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Vérifiez votre boîte de réception (et vos spams).
                </p>
                <Link
                  href="/login"
                  className="text-purple-600 hover:underline"
                >
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Button type="submit" loading={loading} className="w-full">
                  Envoyer le lien
                </Button>
                
                <p className="text-center text-sm text-gray-500">
                  <Link href="/login" className="text-purple-600 hover:underline">
                    Retour à la connexion
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
