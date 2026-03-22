import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getCurrentUserFromToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const user = await getCurrentUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
    }
    
    const { name, bio, location, avatar } = await request.json();
    
    await connectToDatabase();
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: name || user.name,
        bio: bio || '',
        location: location || '',
        avatar: avatar || ''
      },
      { new: true }
    ).select('-password');
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
