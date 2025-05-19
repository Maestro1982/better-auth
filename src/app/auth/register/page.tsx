import Link from 'next/link';

import RegisterForm from '@/components/register-form';
import ReturnButton from '@/components/return-button';

export default function RegisterPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <ReturnButton href='/' label='Home' />
      <div className='w-full max-w-md space-y-6 text-center border border-black rounded-lg p-6'>
        <h1 className='text-3xl font-bold'>Register</h1>
        <RegisterForm />
        <div className='flex items-center'>
          <p className='text-muted-foreground text-sm'>
            Already have an account?
          </p>{' '}
          <Link href={'/auth/login'} className='hover:underline ml-2'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
