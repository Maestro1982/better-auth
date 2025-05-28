'use client';

import Link from 'next/link';

import { useSession } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

const GetStartedButton = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button size={'lg'} className='opacity-50'>
        Get Started
      </Button>
    );
  }

  const href = session ? '/profile' : '/auth/login';

  return (
    <div className='flex flex-col items-center gap-4'>
      <Button size={'lg'} asChild>
        <Link href={href}>{session ? 'Profile' : 'Get Started'}</Link>
      </Button>
      {session && (
        <p className='flex items-center gap-2'>
          <span
            className={`size-4 rounded-full animate-pulse ${
              session.user.role === 'SUPER_ADMIN'
                ? 'bg-green-600'
                : session.user.role === 'ADMIN'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            }`}
          />
          Welcome back, {session.user.name}! 👋
        </p>
      )}
    </div>
  );
};
export default GetStartedButton;
