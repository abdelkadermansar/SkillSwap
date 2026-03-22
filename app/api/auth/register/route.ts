import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail, generateVerificationToken } from '@/lib/email/mailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      skills: [],
      learningGoals: [],
      emailVerified: false,
      verificationToken
    });
    
    // Envoyer email de confirmation
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Bienvenue sur SkillSwap !</h1>
        <p>Bonjour ${name},</p>
        <p>Merci de vous être inscrit sur SkillSwap. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Confirmer mon email
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Ce lien expirera dans 24 heures.</p>
        <hr style="margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">À très vite sur SkillSwap !</p>
      </div>
    `;
    
    await sendEmail({
      to: user.email,
      subject: 'Confirmez votre inscription sur SkillSwap',
      html: emailHtml
    });
    
    return NextResponse.json({
      success: true,
      message: 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.',
      user: { id: user._id, name: user.name, email: user.email }
    });
    
  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}
