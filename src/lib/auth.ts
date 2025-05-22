import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins';

import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/argon2';
import { normalizeName } from '@/lib/utils';
import { UserRole } from '@/generated/prisma';
import { ac, roles } from '@/lib/permissions';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS =
            process.env.ADMIN_EMAIL?.split(';').map((e) =>
              e.trim().toLowerCase()
            ) ?? [];

          //console.log('Checking admin email for:', user.email);
          //console.log('ADMIN_EMAILS:', ADMIN_EMAILS);

          if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            console.log('Assigning ADMIN role');
            return {
              data: { ...user, role: UserRole.ADMIN },
            };
          }

          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'] as Array<UserRole>,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
  account: {
    accountLinking: {
      enabled: false, // Disable account linking
      // This is useful if you want to use the same email for different providers
    },
  },
  advanced: {
    database: {
      generateId: false, // No auto-generated ID for the tables that are used by better-auth, check the prisma schema
    },
  },
  plugins: [
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
  ],
});

// Hover over the auth.$ERROR_CODES to see all the error codes
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
