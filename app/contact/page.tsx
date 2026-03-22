'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'envoi (à remplacer par une vraie API)
    setTimeout(() => {
      toast.success('Message envoyé ! Nous vous répondrons rapidement.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Informations de contact */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <a href="mailto:contact@skillswap.com" className="text-purple-600 hover:underline">
                        contact@skillswap.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-medium text-gray-700">Discord</p>
                      <a href="#" className="text-purple-600 hover:underline">
                        Rejoindre notre serveur
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🐦</span>
                    <div>
                      <p className="font-medium text-gray-700">Twitter</p>
                      <a href="#" className="text-purple-600 hover:underline">
                        @SkillSwap
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">FAQ</h2>
                <p className="text-purple-600 text-sm mb-3">
                  Vous avez une question ? Consultez notre FAQ
                </p>
                <Link
                  href="/faq"
                  className="text-purple-600 font-medium hover:underline text-sm"
                >
                  Voir la FAQ →
                </Link>
              </div>
            </div>
            
            {/* Formulaire */}
            <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                
                <Input
                  label="Sujet"
                  placeholder="Sujet de votre message"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Décrivez votre demande..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                
                <Button type="submit" loading={loading} className="w-full">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
