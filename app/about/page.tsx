import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de SkillSwap</h1>
          
          <div className="bg-white rounded-lg shadow p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notre mission</h2>
              <p className="text-gray-600 leading-relaxed">
                SkillSwap est une plateforme d'échange de compétences gratuite qui connecte des personnes souhaitant 
                apprendre et partager leurs connaissances. Notre mission est de rendre l'apprentissage accessible à tous, 
                sans barrière financière.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comment ça marche ?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Créez votre profil</h3>
                    <p className="text-gray-600">Inscrivez-vous gratuitement et complétez votre profil avec vos compétences</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Publiez ou recherchez</h3>
                    <p className="text-gray-600">Proposez vos compétences ou trouvez quelqu'un pour vous apprendre</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Échangez</h3>
                    <p className="text-gray-600">Contactez les membres et organisez vos sessions d'apprentissage</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pourquoi SkillSwap ?</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Gratuit - Pas de frais, pas d'abonnement</li>
                <li>✓ Communauté bienveillante d'apprenants</li>
                <li>✓ Large choix de compétences</li>
                <li>✓ Apprentissage flexible (en ligne ou en présentiel)</li>
                <li>✓ Système d'évaluation pour garantir la qualité</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">Rejoignez notre communauté</h2>
              <p className="text-purple-600 mb-4">Plus de 500 membres actifs et 1000 échanges réalisés</p>
              <Link
                href="/register"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Créer un compte gratuitement
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
