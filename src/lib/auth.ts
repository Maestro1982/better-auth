import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';

import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { normalizeName } from '@/lib/utils';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const name = normalizeName(ctx.body?.name);

      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            name,
          },
        },
      };
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
  advanced: {
    database: {
      generateId: false, // No auto-generated ID for the tables that are used by better-auth, check the prisma schema
    },
  },
});

// Hover over the auth.$ERROR_CODES to see all the error codes
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
