import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Offer from '@/models/Offer';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Déballer params avec await (Nouveauté Next.js 16)
    const { id } = await params;
    
    console.log('🔵 API GET /offers/[id] - ID reçu:', id);
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('🔴 ID invalide:', id);
      return NextResponse.json(
        { error: 'ID d\'annonce invalide' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const offer = await Offer.findById(id)
      .populate('userId', 'name email avatar bio rating');
    
    if (!offer) {
      console.log('🔴 Annonce non trouvée pour ID:', id);
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }
    
    console.log('✅ Annonce trouvée:', offer.title);
    
    return NextResponse.json({ offer });
    
  } catch (error) {
    console.error('🔴 Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Inconnu' },
      { status: 500 }
    );
  }
}
