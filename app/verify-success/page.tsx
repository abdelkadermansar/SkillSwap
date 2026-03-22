import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email confirmé !</h1>
            <p className="text-gray-600 mb-6">
              Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              href="/login"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
