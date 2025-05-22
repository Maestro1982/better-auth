'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { signIn } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

interface SignInOauthButtonProps {
  provider: 'google' | 'github';
  signUp?: boolean;
}

const SignInOauthButton = ({ provider, signUp }: SignInOauthButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const action = signUp ? 'Up' : 'In';
  const providerName = provider === 'google' ? 'Google' : 'GitHub';

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: '/profile',
      errorCallbackURL: '/auth/login/error',
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
      },
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      Sign {action} with {providerName}
    </Button>
  );
};
export default SignInOauthButton;
