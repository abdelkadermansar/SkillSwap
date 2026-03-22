// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration simple
  reactStrictMode: true,
  
  // Désactiver Turbopack pour éviter les problèmes
  // Si vous voulez utiliser Turbopack, supprimez cette ligne
  // ou utilisez --webpack dans package.json
}

module.exports = nextConfig