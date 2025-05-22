import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/lib/auth';

import SignOutButton from '@/components/sign-out-button';
import ReturnButton from '@/components/return-button';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const headersList = await headers();
  /* If middleware fails to redirect, we can check the session here and redirect if needed
     This is a fallback in case the middleware doesn't work as expected */
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) redirect('/auth/login');

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        posts: ['update', 'delete'],
      },
    },
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6'>
      <ReturnButton href='/' label='Back to Home' />

      <div className='w-full max-w-4xl bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 space-y-8'>
        <h1 className='text-4xl font-extrabold text-gray-800 text-center'>
          User Profile
        </h1>

        {session.user.role === 'ADMIN' ? (
          <div className='space-y-6'>
            <div className='flex items-center justify-center gap-4'>
              <Button size='sm' asChild className='shadow-md'>
                <Link href='/admin/dashboard'>Admin Dashboard</Link>
              </Button>
              <SignOutButton />
            </div>

            <div>
              <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
                Permissions
              </h2>
              <div className='flex gap-4 justify-start'>
                <Button size='sm' variant='default' className='shadow'>
                  Manage Own Posts
                </Button>
                <Button size='sm' disabled={!FULL_POST_ACCESS.success}>
                  Manage All Posts
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            <div className='flex justify-center'>
              <SignOutButton />
            </div>

            <div>
              <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
                Permissions
              </h2>
              <div className='flex gap-4 justify-start'>
                <Button size='sm' variant='default' className='shadow'>
                  Manage Own Posts
                </Button>
                <Button size='sm' disabled={!FULL_POST_ACCESS.success}>
                  Manage All Posts
                </Button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            Session Details
          </h2>
          <div className='bg-gray-100 rounded-lg p-4 text-left text-sm max-h-96 overflow-auto border border-gray-300'>
            <pre className='whitespace-pre-wrap break-words'>
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
