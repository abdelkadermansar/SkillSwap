'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 - Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">SkillSwap</h3>
            <p className="text-gray-400 mb-4">
              La plateforme qui connecte les personnes souhaitant échanger leurs compétences. 
              Apprenez gratuitement en partageant votre expertise !
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
          
          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-white transition">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/offers/create" className="text-gray-400 hover:text-white transition">
                  Proposer un échange
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Colonne 3 - Informations */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Conditions d'utilisation
                </Link>
              </li>
              // Dans la colonne "Informations", ajoutez :
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} SkillSwap. Tous droits réservés.</p>
          <p className="mt-1">Échangez des compétences, pas de l'argent 💫</p>
        </div>
      </div>
    </footer>
  );
}
