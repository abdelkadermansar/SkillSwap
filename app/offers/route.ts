// app/api/offers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Offer from '@/models/Offer';
import { getCurrentUserFromToken } from '@/lib/auth';

// POST - Créer une annonce
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }

    // Récupérer toutes les données
    const { type, title, description, category, skillName, level, location, remotePossible, availability, images } = await request.json();

    // Validation
    if (!title || !description || !category || !skillName) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Création de l'annonce
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
      images: images || [], // <-- AJOUTER CETTE LIGNE
      status: 'active'
    });

    return NextResponse.json({
      success: true,
      offer: {
        id: offer._id,
        title: offer.title,
        type: offer.type,
        category: offer.category,
        skillName: offer.skillName
      }
    });

  } catch (error) {
    console.error('Erreur création annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

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
    console.error('Erreur récupération annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}