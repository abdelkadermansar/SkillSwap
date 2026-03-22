'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ui/ImageUpload';

const categories = [
  'Développement web', 'Mobile', 'Data science', 'Design',
  'Musique', 'Langues', 'Cuisine', 'Sport', 'Photographie',
  'Marketing', 'Business', 'Autre'
];

const levels = ['débutant', 'intermédiaire', 'avancé'];

const availabilities = [
  'Lundi matin', 'Lundi après-midi',
  'Mardi matin', 'Mardi après-midi',
  'Mercredi matin', 'Mercredi après-midi',
  'Jeudi matin', 'Jeudi après-midi',
  'Vendredi matin', 'Vendredi après-midi',
  'Samedi matin', 'Samedi après-midi',
  'Dimanche matin', 'Dimanche après-midi'
];

export default function CreateOfferPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [formData, setFormData] = useState({
    type: 'offer',
    title: '',
    description: '',
    category: '',
    skillName: '',
    level: 'débutant',
    location: '',
    remotePossible: true,
    availability: [] as string[],
    images: [] as string[]  // Ajout des images
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        sessionStorage.setItem('redirectAfterLogin', '/offers/create');
        router.push('/login');
      } else {
        setChecking(false);
      }
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La description est requise');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      toast.error('La catégorie est requise');
      setLoading(false);
      return;
    }
    if (!formData.skillName.trim()) {
      toast.error('Le nom de la compétence est requis');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // formData contient déjà images
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Annonce publiée avec succès !');
        router.push('/explore');
      } else {
        toast.error(data.error || 'Erreur lors de la publication');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {formData.type === 'offer' ? 'Proposer un échange' : 'Demander une compétence'}
        </h1>
        <p className="text-gray-600 mb-8">
          {formData.type === 'offer' 
            ? 'Partagez votre expertise avec la communauté' 
            : 'Trouvez quelqu\'un pour vous apprendre une nouvelle compétence'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Type d'annonce */}
          <div className="flex gap-4 border-b pb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="offer" 
                checked={formData.type === 'offer'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-purple-600" 
              />
              <span className="font-medium">📤 J'offre mon temps</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="request" 
                checked={formData.type === 'request'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-purple-600" 
              />
              <span className="font-medium">📥 Je cherche à apprendre</span>
            </label>
          </div>
          
          {/* Titre */}
          <Input 
            label="Titre *" 
            placeholder="Ex: Cours de guitare pour débutant"
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required 
          />
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              rows={6} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Décrivez ce que vous proposez/recherchez en détail..."
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </div>
          
          {/* Catégorie et Compétence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <Input 
              label="Compétence *" 
              placeholder="Ex: Guitare, Python, Anglais..."
              value={formData.skillName} 
              onChange={(e) => setFormData({ ...formData, skillName: e.target.value })} 
              required 
            />
          </div>
          
          {/* Niveau et Visio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={formData.level} 
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                checked={formData.remotePossible}
                onChange={(e) => setFormData({ ...formData, remotePossible: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded" 
              />
              <span>✅ Possibilité à distance (visio)</span>
            </label>
          </div>
          
          {/* Localisation */}
          <Input 
            label="Localisation" 
            placeholder="Ville, quartier..."
            value={formData.location} 
            onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
          />
          
          {/* Disponibilités */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilités</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availabilities.map(day => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    value={day} 
                    checked={formData.availability.includes(day)}
                    onChange={() => toggleAvailability(day)} 
                    className="w-4 h-4 text-purple-600 rounded" 
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Upload d'images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (optionnel)
            </label>
            <ImageUpload
              onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
              maxImages={5}
            />
          </div>
          
          {/* Bouton de soumission */}
          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Publication en cours...' : '📢 Publier l\'annonce'}
          </Button>
        </form>
      </div>
    </div>
  );
}