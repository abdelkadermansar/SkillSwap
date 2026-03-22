import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const faqs = [
  {
    question: "Comment fonctionne SkillSwap ?",
    answer: "SkillSwap est une plateforme où vous pouvez échanger des compétences gratuitement. Vous pouvez proposer une compétence que vous maîtrisez ou demander à apprendre quelque chose de nouveau. Trouvez quelqu'un, discutez et organisez vos sessions d'apprentissage."
  },
  {
    question: "Est-ce vraiment gratuit ?",
    answer: "Oui, SkillSwap est totalement gratuit ! Pas de frais d'inscription, pas d'abonnement. Nous croyons en l'apprentissage libre et accessible à tous."
  },
  {
    question: "Comment créer une annonce ?",
    answer: "Connectez-vous, allez sur 'Proposer un échange', remplissez le formulaire avec votre titre, description, catégorie et disponibilités. Ajoutez des photos si vous le souhaitez, puis publiez !"
  },
  {
    question: "Comment contacter quelqu'un ?",
    answer: "Sur la page de détail d'une annonce, cliquez sur le bouton 'Contacter'. Une conversation privée s'ouvrira où vous pourrez discuter et organiser votre échange."
  },
  {
    question: "Puis-je modifier ou supprimer mon annonce ?",
    answer: "Oui, allez sur votre annonce et vous verrez les boutons 'Modifier' et 'Supprimer' (uniquement si vous êtes le propriétaire)."
  },
  {
    question: "Comment ajouter une photo de profil ?",
    answer: "Allez dans 'Mon profil' (icône 👤), puis uploader une photo via le bouton d'upload. Les photos sont stockées sur Cloudinary."
  },
  {
    question: "Les échanges sont-ils en ligne ou en présentiel ?",
    answer: "Les deux ! Chaque annonce indique si la personne accepte les échanges à distance (visio) ou uniquement en présentiel. Vous pouvez choisir ce qui vous convient."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Foire aux questions</h1>
          <p className="text-gray-600 mb-8">
            Vous avez des questions ? Voici les réponses les plus fréquentes.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h2>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous n'avez pas trouvé votre réponse ?
            </p>
            <Link
              href="/contact"
              className="inline-block mt-2 text-purple-600 hover:underline"
            >
              Contactez-nous →
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
