'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signOut } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

const SignOutButton = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('Signed out successfully');
          router.push('/auth/login');
        },
      },
    });
  }

  return (
    <Button
      onClick={handleSignOut}
      size={'sm'}
      variant={'destructive'}
      disabled={isPending}
    >
      Sign Out
    </Button>
  );
};
export default SignOutButton;
