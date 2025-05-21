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

  async function handleDelete() {
    setIsPending(true);
    const { error } = await deleteUserAction({ userId });
    if (error) {
      toast.error(error);
    } else {
      toast.success('User deleted successfully');
    }
    setIsPending(false);
  }

  return (
    <Button
      size={'icon'}
      variant={'destructive'}
      className='size-7 rounded-sm'
      disabled={isPending}
      onClick={handleDelete}
    >
      <span className='sr-only'>Delete User</span>
      <TrashIcon />
    </Button>
  );
};
export default DeleteUserButton;

export const PlaceholderDeleteButton = () => {
  return (
    <Button
      size={'icon'}
      variant={'destructive'}
      className='size-7 rounded-sm'
      disabled
    >
      <span className='sr-only'>Delete User</span>
      <TrashIcon />
    </Button>
  );
};
