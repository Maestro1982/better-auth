'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers();

  const session = await auth.api.getSession({ headers: headersList });
  if (!session) throw new Error('Unauthorized');

  const sessionUserId = session.user.id;

  // ⛔ Prevent self-deletion
  if (sessionUserId === userId) {
    throw new Error('You cannot delete your own account');
  }

  // ✅ Fetch full acting user info from DB (not just session)
  const actingUser = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: { id: true, role: true },
  });

  if (!actingUser) throw new Error('Acting user not found');

  // ✅ Fetch target user info
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) throw new Error('Target user not found');

  const actingIsSuperAdmin = actingUser.role === 'SUPER_ADMIN';

  // ⛔ Block deletion of SUPER_ADMINs
  if (targetUser.role === 'SUPER_ADMIN') {
    throw new Error('You cannot delete a SUPER_ADMIN');
  }

  // ⛔ Only SUPER_ADMIN can delete ADMINs
  if (targetUser.role === 'ADMIN' && !actingIsSuperAdmin) {
    throw new Error('Only SUPER_ADMIN can delete ADMINs');
  }

  try {
    // ✅ Remove user using BetterAuth
    await auth.api.removeUser({
      headers: headersList,
      body: { userId },
      method: 'POST',
    });

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Internal Server Error',
    };
  }
}
