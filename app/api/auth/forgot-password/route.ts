import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generateVerificationToken } from '@/lib/email/mailer';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Pour des raisons de sécurité, on ne dit pas que l'email n'existe pas
      return NextResponse.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }
    
    const resetToken = generateVerificationToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Expire dans 1 heure
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Réinitialisation de mot de passe</h1>
        <p>Bonjour ${user.name},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <hr style="margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">L'équipe SkillSwap</p>
      </div>
    `;
    
    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe SkillSwap',
      html: emailHtml
    });
    
    return NextResponse.json({ success: true, message: 'Un email de réinitialisation a été envoyé.' });
    
  } catch (error) {
    console.error('Erreur forgot-password:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
