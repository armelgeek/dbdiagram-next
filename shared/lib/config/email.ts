import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import {
  ChangeEmailVerificationTemplate,
  ResetPasswordEmailTemplate,
  VerificationEmailTemplate,
  WelcomeEmailTemplate,
  EmailChangeVerificationImprovedTemplate,
  PasswordResetImprovedTemplate
} from '@/features/auth/components/organisms/email-templates';
import { kAppName } from '../constants/app.constant';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async ({ email, verificationUrl, }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Email address",
    html: await render(
      VerificationEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async ({
                                               email,
                                               verificationUrl,
                                             }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Link",
    html: await render(
      ResetPasswordEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendChangeEmailVerification = async ({ email, verificationUrl }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Change Email Verification",
    html: await render(
      ChangeEmailVerificationTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async ({ email, userName, verificationUrl }: {
  email: string;
  userName: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Welcome to ${kAppName} - Verify your email to get started!`,
    html: await render(
      WelcomeEmailTemplate({ 
        userName, 
        verificationUrl 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendImprovedResetPasswordEmail = async ({
  email,
  verificationUrl,
  userName,
}: {
  email: string;
  verificationUrl: string;
  userName?: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Reset your ${kAppName} password`,
    html: await render(
      PasswordResetImprovedTemplate({ 
        verificationUrl, 
        userName 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Improved reset password email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending improved reset password email:', error);
    throw error;
  }
};

export const sendImprovedChangeEmailVerification = async ({ email, verificationUrl, newEmail }: {
  email: string;
  verificationUrl: string;
  newEmail: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Verify your new email address for ${kAppName}`,
    html: await render(
      EmailChangeVerificationImprovedTemplate({ 
        verificationUrl, 
        newEmail 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Improved email change verification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending improved email change verification:', error);
    throw error;
  }
};


