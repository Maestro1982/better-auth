'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';

export async function deleteUserAction({ userId }: { userId: string }) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) throw new Error('Unauthorized');

  // Prevent non-admins or self-deletion
  if (session.user.role !== 'ADMIN' || session.user.id === userId) {
    throw new Error('Access Denied');
  }

  try {
    // Using the admin plugin to remove a user
    await auth.api.removeUser({
      headers: headersList,
      body: {
        userId,
      },
      method: 'POST',
    });

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Internal Server Error' };
  }
}
