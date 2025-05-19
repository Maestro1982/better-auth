'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signOut } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

const SignOutButton = () => {
  const router = useRouter();
  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          router.push('/auth/login');
        },
      },
    });
  }

  return (
    <Button onClick={handleSignOut} size={'sm'} variant={'destructive'}>
      Sign Out
    </Button>
  );
};
export default SignOutButton;
