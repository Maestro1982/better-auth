import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/lib/auth';

import SignOutButton from '@/components/sign-out-button';
import ReturnButton from '@/components/return-button';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  /* If middleware fails to redirect, we can check the session here and redirect if needed
     This is a fallback in case the middleware doesn't work as expected */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/auth/login');

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <ReturnButton href='/' label='Home' />
      <div className='w-full max-w-md space-y-6 text-center border border-black rounded-lg p-6'>
        <h1 className='text-3xl font-bold'>Profile</h1>
        {session.user.role === 'ADMIN' ? (
          <div className='flex items-center justify-center gap-4'>
            <Button size='sm' asChild>
              <Link href='/admin/dashboard'>Admin Dashboard</Link>
            </Button>
            <SignOutButton />
          </div>
        ) : (
          <div className='flex justify-center'>
            <SignOutButton />
          </div>
        )}
        <h2 className='text-2xl font-bold'>Session Details</h2>
        <pre className='text-sm overflow-clip'>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
