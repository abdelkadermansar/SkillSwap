import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getCurrentUserFromToken } from '@/lib/auth';

// GET - Récupérer les messages d'une conversation
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
    
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation requise' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est bien dans la conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(user._id)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    
    // Marquer les messages comme lus (ceux qui ne sont pas de l'utilisateur actuel)
    const result = await Message.updateMany(
      { 
        conversationId: conversationId, 
        senderId: { $ne: user._id },
        read: false 
      },
      { read: true, readAt: new Date() }
    );
    
    console.log(`✅ Marqué ${result.modifiedCount} messages comme lus`);
    
    // Réinitialiser le compteur de non-lus pour cet utilisateur
    if (conversation.unreadCount) {
      const unreadMap = new Map(conversation.unreadCount);
      unreadMap.delete(user._id.toString());
      conversation.unreadCount = unreadMap;
      await conversation.save();
    }
    
    // Récupérer les messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name avatar');
    
    return NextResponse.json({ messages });
    
  } catch (error) {
    console.error('Erreur GET messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Envoyer un message
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
    
    const { conversationId, content } = await request.json();
    
    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Vérifier que l'utilisateur est dans la conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(user._id)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }
    
    // Créer le message
    const message = await Message.create({
      conversationId,
      senderId: user._id,
      content: content.trim(),
      read: false
    });
    
    // Mettre à jour la conversation
    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    
    // Incrémenter le compteur de non-lus pour l'autre participant
    const otherParticipant = conversation.participants.find(p => p.toString() !== user._id.toString());
    if (otherParticipant) {
      const currentUnread = conversation.unreadCount?.get(otherParticipant.toString()) || 0;
      conversation.unreadCount?.set(otherParticipant.toString(), currentUnread + 1);
    }
    
    await conversation.save();
    
    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name avatar');
    
    return NextResponse.json({ message: populatedMessage });
    
  } catch (error) {
    console.error('Erreur POST messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
