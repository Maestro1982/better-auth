import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc } from 'better-auth/plugins/admin/access';

import { UserRole } from '@/generated/prisma';

const statements = {
  posts: [
    'create',
    'read',
    'update',
    'delete',
    'update:own',
    'delete:own',
  ] as const,
  user: [
    'create',
    'list',
    'set-role',
    'ban',
    'impersonate',
    'delete',
    'set-password',
  ] as const,
  session: ['list', 'revoke', 'delete'] as const, // exactly matching adminAc.session
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  [UserRole.USER]: ac.newRole({
    posts: ['create', 'read', 'update:own', 'delete:own'],
  }),

  [UserRole.ADMIN]: ac.newRole({
    posts: ['create', 'read', 'update', 'delete', 'update:own', 'delete:own'],
    ...adminAc.statements,
  }),

  [UserRole.SUPER_ADMIN]: ac.newRole({
    posts: [...statements.posts],
    user: [...statements.user],
    session: [...statements.session],
  }),
};
