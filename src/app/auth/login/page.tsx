import Link from 'next/link';

import LoginForm from '@/components/login-form';
import ReturnButton from '@/components/return-button';

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6'>
      <ReturnButton href='/' label='Back to Home' />
      <div className='w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-800'>Login</h1>
        <LoginForm />
        <div className='text-sm text-gray-600 flex items-center justify-center'>
          <span>Don&apos;t have an account?</span>
          <Link
            href='/auth/register'
            className='ml-2 font-medium text-blue-600 hover:underline'
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
