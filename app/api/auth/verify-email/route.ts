import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    // Rediriger vers la page de succès
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/verify-success`);
    
  } catch (error) {
    console.error('Erreur vérification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
