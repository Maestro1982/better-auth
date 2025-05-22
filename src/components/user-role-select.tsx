'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { UserRole } from '@/generated/prisma';
import { admin } from '@/lib/auth-client';

interface UserRoleSelectProps {
  userId: string;
  role: UserRole;
  currentUserId: string;
}

const UserRoleSelect = ({
  userId,
  role,
  currentUserId,
}: UserRoleSelectProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isEditingSelf = userId === currentUserId; // check if editing own role

  async function handleRoleChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = evt.target.value as UserRole;
    setIsPending(true);

    const canChangeRole = await admin.hasPermission({
      permissions: {
        user: ['set-role'],
      },
    });

    if (canChangeRole.error) {
      toast.error('You do not have permission to change roles');
      return;
    }

    if (newRole !== 'USER' && newRole !== 'ADMIN') {
      toast.error('You cannot assign this role');
      return;
    }

    await admin.setRole({
      userId,
      role: newRole,
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => setIsPending(false),
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('User role updated successfully');
          router.refresh();
        },
      },
    });
  }

  return (
    <select
      value={role}
      onChange={handleRoleChange}
      disabled={role === 'SUPER_ADMIN' || isPending || isEditingSelf}
      className='px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50'
    >
      <option value='ADMIN'>ADMIN</option>
      <option value='USER'>USER</option>
      {role === 'SUPER_ADMIN' && (
        <option value='SUPER_ADMIN' disabled>
          SUPER_ADMIN
        </option>
      )}
    </select>
  );
};

export default UserRoleSelect;
