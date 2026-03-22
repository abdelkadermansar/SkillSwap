// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Récupérer l'URI depuis .env.local
    const uri = process.env.MONGODB_URI;
    
    console.log('URI MongoDB:', uri); // Pour vérifier dans le terminal
    
    // Tenter de se connecter
    await mongoose.connect(uri as string);
    
    // Vérifier l'état
    const state = mongoose.connection.readyState;
    const stateText = {
      0: 'déconnecté',
      1: 'connecté',
      2: 'connexion en cours',
      3: 'déconnexion en cours'
    };
    
    return NextResponse.json({
      success: state === 1,
      message: state === 1 ? '✅ MongoDB connecté !' : '⚠️ État: ' + stateText[state as keyof typeof stateText],
      uri: uri?.replace('mongodb://', 'mongodb://***') // Masque le début pour la sécurité
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      help: 'Vérifiez que MongoDB est lancé (mongod) et que .env.local est correct'
    }, { status: 500 });
  }
}