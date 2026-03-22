// app/api/test-user/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const testUser = await User.create({
      name: 'Jean Dupont',
      email: 'jean@test.com',
      password: hashedPassword,
      bio: 'Développeur web passionné',
      location: 'Paris',
      skills: [
        { name: 'React', level: 'avancé' },
        { name: 'Next.js', level: 'intermédiaire' }
      ],
      learningGoals: ['Anglais', 'Guitare']
    });
    
    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès !',
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        skills: testUser.skills
      }
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}