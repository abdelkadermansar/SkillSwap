// app/api/offers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Offer from '@/models/Offer';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'monSecretSuperLong';

// GET - Récupérer les annonces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const skill = searchParams.get('skill');

    await connectToDatabase();

    let filter: any = { status: 'active' };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (skill) filter.skillName = { $regex: skill, $options: 'i' };

    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name avatar rating');

    return NextResponse.json({
      success: true,
      offers
    });

  } catch (error) {
    console.error('Erreur GET /api/offers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

// POST - Créer une annonce
export async function POST(request: NextRequest) {
  try {
    // Récupérer le token
    const token = request.cookies.get('token')?.value;
    
    console.log('🔵 POST /api/offers - Token présent:', token ? 'OUI' : 'NON');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    
    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('🔵 POST /api/offers - userId:', decoded.userId);
    } catch (err) {
      console.error('🔴 Token invalide:', err);
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('🔴 Utilisateur non trouvé');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 401 }
      );
    }
    
    console.log('🔵 Utilisateur trouvé:', user.name);
    
    // Récupérer les données du formulaire
    const body = await request.json();
    console.log('🔵 Données reçues:', body);
    
    const { type, title, description, category, skillName, level, location, remotePossible, availability } = body;
    
    // Validation
    if (!title || !description || !category || !skillName) {
      console.error('🔴 Champs manquants:', { title, description, category, skillName });
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    // Créer l'annonce
    const offer = await Offer.create({
      userId: user._id,
      type: type || 'offer',
      title,
      description,
      category,
      skillName,
      level: level || 'débutant',
      location: location || '',
      remotePossible: remotePossible ?? true,
      availability: availability || [],
      status: 'active'
    });
    
    console.log('✅ Annonce créée:', offer._id);
    
    return NextResponse.json({
      success: true,
      message: 'Annonce créée avec succès',
      offer: {
        id: offer._id,
        title: offer.title,
        type: offer.type,
        category: offer.category,
        skillName: offer.skillName
      }
    });
    
  } catch (error) {
    console.error('🔴 Erreur POST /api/offers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création', details: error instanceof Error ? error.message : 'Inconnu' },
      { status: 500 }
    );
  }
}