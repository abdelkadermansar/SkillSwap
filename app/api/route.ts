// app/api/offers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Offer from '@/models/Offer';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const offer = await Offer.findById(id).populate('userId', 'name email avatar bio rating');
    
    if (!offer) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json({ offer });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Modifier une annonce
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const offer = await Offer.findById(id);
    if (!offer) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    
    if (offer.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    
    const updates = await request.json();
    
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      {
        type: updates.type,
        title: updates.title,
        description: updates.description,
        category: updates.category,
        skillName: updates.skillName,
        level: updates.level,
        location: updates.location,
        remotePossible: updates.remotePossible,
        availability: updates.availability,
        images: updates.images
      },
      { new: true }
    );
    
    return NextResponse.json({ offer: updatedOffer });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une annonce
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const offer = await Offer.findById(id);
    if (!offer) {
      return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
    }
    
    if (offer.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    
    await Offer.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}