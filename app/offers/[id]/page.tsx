'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [id, setId] = useState<string | null>(null);

  // Dans Next.js 16, params est une Promise
  useEffect(() => {
    async function getId() {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    }
    getId();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchOffer();
    }
  }, [id]);

  const fetchOffer = async () => {
    try {
      console.log('🔵 Page - Fetching:', `/api/offers/${id}`);
      const response = await fetch(`/api/offers/${id}`);
      console.log('🔵 Page - Response status:', response.status);
      
      const data = await response.json();
      console.log('🔵 Page - Data:', data);
      
      if (response.ok) {
        setOffer(data.offer);
      } else {
        setError(data.error || 'Annonce non trouvée');
      }
    } catch (err) {
      console.error('🔴 Page - Exception:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', `/offers/${id}`);
      router.push('/login');
      return;
    }

    // Vérifier si c'est sa propre annonce
    if (user?.id === offer.userId?._id) {
      toast.error("Vous ne pouvez pas contacter votre propre annonce");
      return;
    }

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otherUserId: offer.userId._id,
          offerId: offer._id
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/messages/${data.conversation._id}`);
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    
    try {
      const response = await fetch(`/api/offers/${offer._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Annonce supprimée');
        router.push('/explore');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
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

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow p-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Annonce non trouvée</h2>
            <p className="text-gray-500 mb-6">{error || "L'annonce n'existe pas"}</p>
            <p className="text-sm text-gray-400 mb-4">ID recherché: {id}</p>
            <Link href="/explore" className="text-purple-600 hover:underline font-medium">
              ← Retour à l'exploration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === offer.userId?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/explore" className="text-purple-600 hover:underline text-sm mb-4 inline-block">
          ← Retour à l'exploration
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Images de l'annonce */}
          {offer.images && offer.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-gray-100">
              {offer.images.slice(0, 3).map((url: string, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(url, '_blank')}
                  />
                </div>
              ))}
              {offer.images.length > 3 && (
                <div className="relative aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">+{offer.images.length - 3}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="p-6">
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                offer.type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <span>{offer.type === 'offer' ? '🎓' : '📚'}</span>
                <span>{offer.type === 'offer' ? 'Offre' : 'Demande'}</span>
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{offer.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                🏷️ {offer.category}
              </span>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full capitalize">
                📊 {offer.level}
              </span>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                {offer.remotePossible ? '🎥 Visio possible' : '📍 Présentiel'}
              </span>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                📍 {offer.location || 'En ligne'}
              </span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Compétence</h2>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-purple-700 font-medium">{offer.skillName}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">
                  Publié par <span className="font-medium text-gray-700">{offer.userId?.name || 'Utilisateur'}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex gap-3">
                {!isOwner && isAuthenticated && (
                  <Button onClick={handleContact}>
                    💬 Contacter {offer.userId?.name}
                  </Button>
                )}
                
                {isOwner && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/offers/${offer._id}/edit`)}
                    >
                      ✏️ Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDelete}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      🗑️ Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}