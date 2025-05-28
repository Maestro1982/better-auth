'use client';

import { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { deleteUserAction } from '@/actions/delete-user-action';
import { Button } from '@/components/ui/button';

interface DeleteUserButtonProps {
  userId: string;
}

const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  async function handleDelete() {
    setIsPending(true);
    const { error } = await deleteUserAction({ userId });

    if (error) {
      toast.error(error);
    } else {
      toast.success('User deleted successfully');
    }

    setIsPending(false);
    setShowConfirm(false);
  }

  return (
    <>
      <Button
        size='icon'
        variant='destructive'
        className='size-7 rounded-sm'
        disabled={isPending}
        onClick={() => setShowConfirm(true)}
      >
        <span className='sr-only'>Delete User</span>
        <TrashIcon />
      </Button>

      {showConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4'>
            <h2 className='text-lg font-bold text-gray-800'>
              Are you sure you want to delete this user?
            </h2>
            <p className='text-sm text-gray-600'>
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <Button variant='ghost' onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserButton;

export const PlaceholderDeleteButton = () => {
  return (
    <Button
      size='icon'
      variant='destructive'
      className='size-7 rounded-sm'
      disabled
    >
      <span className='sr-only'>Delete User</span>
      <TrashIcon />
    </Button>
  );
};
