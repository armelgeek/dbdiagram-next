import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/drizzle/db';
import { redis } from '@/shared/lib/config/redis';
import { sendImprovedChangeEmailVerification, sendImprovedResetPasswordEmail, sendWelcomeEmail } from '@/shared/lib/config/email';
import { username } from 'better-auth/plugins/username';
import { anonymous } from 'better-auth/plugins/anonymous';
import { nextCookies } from 'better-auth/next-js';
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  advanced: {
    generateId: false,
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { EX: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
   additionalFields: {
     username: { type: "string", required: false },
   },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendImprovedChangeEmailVerification({
          email: newEmail,
          verificationUrl: url,
          newEmail: newEmail,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async (_session, _request) => {
        /**await sendDeleteAccountVerification({
          email: session.user.email,
          verificationUrl: request.url,
        });**/
      },
    },
  },
  rateLimit: {
    window: 60, // time window in seconds
    max: 5, // max requests in the window
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendImprovedResetPasswordEmail({
        email: user.email,
        verificationUrl: url,
        userName: user.name,
      });

    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 1, // 1 HOUR
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendWelcomeEmail({
        email: user.email,
        userName: user.name || 'New User',
        verificationUrl: verificationUrl,
      });

    },
  },
  plugins: [
    username(), 
    anonymous(), 
    nextCookies()
  ],

});
