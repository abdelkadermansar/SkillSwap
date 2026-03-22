'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Offer {
  _id: string;
  type: 'offer' | 'request';
  title: string;
  description: string;
  category: string;
  skillName: string;
  level: string;
  location: string;
  remotePossible: boolean;
  availability: string[];
  status: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    avatar: string;
    rating: number;
  };
}

const categories = [
  'Toutes',
  'Développement web',
  'Mobile',
  'Data science',
  'Design',
  'Musique',
  'Langues',
  'Cuisine',
  'Sport',
  'Photographie',
  'Marketing',
  'Business',
  'Autre'
];

const levels = ['Tous', 'débutant', 'intermédiaire', 'avancé'];

export default function ExplorePage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'Toutes',
    type: 'tous',
    level: 'Tous',
    search: ''
  });

  // Charger les annonces
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      if (response.ok) {
        setOffers(data.offers);
      } else {
        toast.error('Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les annonces
  const filteredOffers = offers.filter(offer => {
    // Filtre catégorie
    if (filters.category !== 'Toutes' && offer.category !== filters.category) {
      return false;
    }
    // Filtre type (offre/demande)
    if (filters.type !== 'tous' && offer.type !== filters.type) {
      return false;
    }
    // Filtre niveau
    if (filters.level !== 'Tous' && offer.level !== filters.level) {
      return false;
    }
    // Filtre recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return offer.title.toLowerCase().includes(searchLower) ||
             offer.skillName.toLowerCase().includes(searchLower) ||
             offer.description.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getTypeBadge = (type: string) => {
    if (type === 'offer') {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">📤 Offre</span>;
    }
    return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">📥 Demande</span>;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      débutant: 'bg-green-100 text-green-800',
      intermédiaire: 'bg-yellow-100 text-yellow-800',
      avancé: 'bg-red-100 text-red-800'
    };
    const levelText = {
      débutant: '🌟 Débutant',
      intermédiaire: '⭐ Intermédiaire',
      avancé: '🚀 Avancé'
    };
    return (
      <span className={`${colors[level as keyof typeof colors]} text-xs px-2 py-1 rounded-full`}>
        {levelText[level as keyof typeof levelText]}
      </span>
    );
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Explorer les annonces</h1>
            <p className="text-gray-600 mt-2">
              Découvrez des personnes avec qui partager vos compétences
            </p>
          </div>
          
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="tous">Tous les types</option>
                <option value="offer">Offres</option>
                <option value="request">Demandes</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Résultats */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">Aucune annonce trouvée</p>
              <p className="text-gray-400 mt-2">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <Link
                  key={offer._id}
                  href={`/offers/${offer._id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden block"
                >
                  {/* Images de l'annonce (première image si disponible) */}
                  {(offer as any).images && (offer as any).images.length > 0 && (
                    <div className="relative h-40 w-full bg-gray-200">
                      <img
                        src={(offer as any).images[0]}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    {/* En-tête de la carte */}
                    <div className="flex justify-between items-start mb-3">
                      {getTypeBadge(offer.type)}
                      <span className="text-xs text-gray-400">{formatDate(offer.createdAt)}</span>
                    </div>
                    
                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {offer.title}
                    </h3>
                    
                    {/* Compétence */}
                    <div className="mb-3">
                      <span className="text-sm text-purple-600 font-medium">
                        {offer.skillName}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {offer.description}
                    </p>
                    
                    {/* Informations supplémentaires */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getLevelBadge(offer.level)}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        📍 {offer.location || 'En ligne'}
                      </span>
                      {offer.remotePossible && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          🎥 Visio possible
                        </span>
                      )}
                    </div>
                    
                    {/* Utilisateur */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      {offer.userId?.avatar ? (
                        <img
                          src={offer.userId.avatar}
                          alt={offer.userId.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-medium">
                            {offer.userId?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{offer.userId?.name}</p>
                        {offer.userId?.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-xs">★</span>
                            <span className="text-xs text-gray-500">{offer.userId.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}