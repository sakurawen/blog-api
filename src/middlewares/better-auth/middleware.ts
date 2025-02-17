import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '~/schema';
import { factory } from '../factory';

export const betterAuthMiddleware = factory.createMiddleware(async (c, next) => {
  const db = c.var.db;
  const auth = betterAuth({
    baseURL: c.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [
      'http://localhost:3000',
      'https://www.akumanoko.com',
    ],
    socialProviders: {
      github: {
        clientId: c.env.GITHUB_CLIENT_ID,
        clientSecret: c.env.GITHUB_CLIENT_SECRET,
      },
    },
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
  });
  c.set('auth', auth);
  await next();
});
