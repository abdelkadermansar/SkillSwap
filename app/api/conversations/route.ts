import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import { getCurrentUserFromToken } from '@/lib/auth';

// GET - Récupérer les conversations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const conversations = await Conversation.find({
      participants: user._id,
      status: 'active'
    })
      .populate('participants', 'name avatar')
      .sort({ lastMessageAt: -1 });
    
    // Transformer unreadCount de Map vers objet simple
    const formattedConversations = conversations.map(conv => {
      const obj = conv.toObject();
      // Convertir Map en objet simple
      obj.unreadCount = Object.fromEntries(conv.unreadCount || new Map());
      return obj;
    });
    
    return NextResponse.json({ conversations: formattedConversations });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer ou obtenir une conversation
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
    
    const { otherUserId, offerId } = await request.json();
    
    if (!otherUserId) {
      return NextResponse.json({ error: 'Utilisateur requis' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Vérifier si une conversation existe déjà
    let conversation = await Conversation.findOne({
      participants: { $all: [user._id, otherUserId] },
      status: 'active'
    });
    
    // Sinon, en créer une nouvelle
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [user._id, otherUserId],
        offerId: offerId || null,
        unreadCount: new Map()
      });
    }
    
    const obj = conversation.toObject();
    obj.unreadCount = Object.fromEntries(conversation.unreadCount || new Map());
    
    return NextResponse.json({ conversation: obj });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
