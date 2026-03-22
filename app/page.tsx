import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Échangez des compétences,
              <span className="block text-purple-200">pas de l'argent</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Rejoignez une communauté d'apprenants et partagez vos connaissances gratuitement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/explore"
                className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Explorer les annonces
              </Link>
            </div>
          </div>
        </section>
        
        {/* Fonctionnalités */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment ça fonctionne ?
              </h2>
              <p className="text-xl text-gray-600">
                Simple, gratuit et efficace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Publiez une annonce</h3>
                <p className="text-gray-600">
                  Proposez une compétence que vous maîtrisez ou demandez à apprendre quelque chose de nouveau
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Connectez-vous</h3>
                <p className="text-gray-600">
                  Trouvez des personnes partageant les mêmes centres d'intérêt et discutez avec elles
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Échangez</h3>
                <p className="text-gray-600">
                  Organisez des sessions d'apprentissage et développez de nouvelles compétences
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Catégories populaires */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Catégories populaires
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les compétences les plus recherchées
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: '💻 Développement web', icon: '💻', count: '128' },
                { name: '🎵 Musique', icon: '🎵', count: '89' },
                { name: '🗣️ Langues', icon: '🗣️', count: '156' },
                { name: '🎨 Design', icon: '🎨', count: '67' },
                { name: '📊 Marketing', icon: '📊', count: '45' },
                { name: '🍳 Cuisine', icon: '🍳', count: '73' },
                { name: '🏋️ Sport', icon: '🏋️', count: '52' },
                { name: '📸 Photographie', icon: '📸', count: '38' }
              ].map((cat, i) => (
                <Link
                  key={i}
                  href={`/explore?category=${cat.name.replace(' ', '%20')}`}
                  className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition border border-gray-100"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-medium text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count} annonces</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Statistiques */}
        <section className="bg-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-purple-200">Membres actifs</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-purple-200">Échanges réalisés</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-purple-200">Compétences disponibles</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Appel à l'action */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez notre communauté et partagez vos compétences dès aujourd'hui
            </p>
            <Link
              href="/register"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
            >
              Créer un compte gratuitement
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
