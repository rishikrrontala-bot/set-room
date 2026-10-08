import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { nextCookies } from 'better-auth/next-js';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/db/auth-schema';
import { getClient } from '@/lib/storage';

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET must be configured with at least 32 characters.');
  }
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const baseURL = process.env.BETTER_AUTH_URL || (productionHost ? `https://${productionHost}` : undefined);
  const trustedOrigins = new Set<string>();
  if (baseURL) trustedOrigins.add(new URL(baseURL).origin);
  if (process.env.VERCEL_URL) trustedOrigins.add(new URL(`https://${process.env.VERCEL_URL}`).origin);
  if (!process.env.VERCEL) {
    trustedOrigins.add('http://localhost:3000');
    trustedOrigins.add('http://127.0.0.1:3000');
  }

  return betterAuth({
    appName: 'Set Room',
    secret,
    baseURL,
    basePath: '/api/auth',
    trustedOrigins: [...trustedOrigins],
    database: drizzleAdapter(drizzle(getClient(), { schema }), {
      provider: 'sqlite',
      schema,
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      // Saved rooms always use the live database session, including revocation.
      cookieCache: { enabled: false },
    },
    advanced: { cookiePrefix: 'set-room' },
    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 120,
      customRules: {
        '/sign-in/email': { window: 60, max: 10 },
        '/sign-up/email': { window: 60, max: 5 },
      },
    },
    plugins: [nextCookies()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

// Credentials and database connections are read when a request needs auth.
export function getAuth() {
  return auth ??= createAuth();
}
