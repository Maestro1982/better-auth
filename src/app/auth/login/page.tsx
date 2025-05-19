import Link from 'next/link';

import LoginForm from '@/components/login-form';
import ReturnButton from '@/components/return-button';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <ReturnButton href='/' label='Home' />
      <div className='w-full max-w-md space-y-6 text-center border border-black rounded-lg p-6'>
        <h1 className='text-3xl font-bold'>Login</h1>
        <LoginForm />
        <div className='flex items-center'>
          <p className='text-muted-foreground text-sm'>
            Don&apos;t have an account?
          </p>{' '}
          <Link href={'/auth/register'} className='hover:underline ml-2'>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
