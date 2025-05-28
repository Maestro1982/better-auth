import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
//import Image from 'next/image';

import { auth } from '@/lib/auth';

import { Button } from '@/components/ui/button';

import SignOutButton from '@/components/sign-out-button';
import ReturnButton from '@/components/return-button';
import UpdateUserForm from '@/components/update-user-form';
import ChangePasswordForm from '@/components/change-password-form';

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

        <div className='flex justify-center'>
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session?.user?.image}
              alt='User Image'
              width={80}
              height={80}
              className='w-20 h-20 border border-primary rounded-md object-cover shadow-md'
            />
          ) : (
            <div className='w-20 h-20 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-md'>
              <span className='uppercase font-bold text-lg'>
                {session.user.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {session.user.role === 'ADMIN' ||
        session.user.role === 'SUPER_ADMIN' ? (
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

        <div className='space-y-4 p-4 rounded-b-md border border-t-8 border-blue-600'>
          <h2 className='text-2xl font-bold'>Update User</h2>
          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ''}
          />
        </div>

        <div className='space-y-4 p-4 rounded-b-md border border-t-8 border-red-600'>
          <h2 className='text-2xl font-bold'>Change Password</h2>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
