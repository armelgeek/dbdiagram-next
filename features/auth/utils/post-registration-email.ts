import { sendWelcomeEmail } from '@/shared/lib/config/email';

export const sendPostRegistrationWelcomeEmail = async (userData: {
  email: string;
  name: string;
}) => {
  try {
    // Email de bienvenue après inscription réussie (sans lien de vérification)
    await sendWelcomeEmail({
      email: userData.email,
      userName: userData.name,
      verificationUrl: `${process.env.BETTER_AUTH_URL}/login` // Redirect vers login
    });
    
    console.log(`Welcome email sent to ${userData.email}`);
  } catch (error) {
    console.error('Error sending post-registration welcome email:', error);
    // Ne pas faire échouer le processus d'inscription si l'email échoue
  }
};
