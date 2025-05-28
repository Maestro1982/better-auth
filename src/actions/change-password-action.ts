'use server';

import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

interface ChangePasswordResult {
  error: string | null;
}

export async function changePasswordAction(
  formData: FormData
): Promise<ChangePasswordResult> {
  const currentPassword = String(formData.get('currentPassword') ?? '').trim();
  if (!currentPassword) return { error: 'Please enter your current password' };

  const newPassword = String(formData.get('newPassword') ?? '').trim();
  if (!newPassword) return { error: 'Please enter your new password' };

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }

    return { error: 'Internal Server Error' };
  }
}
