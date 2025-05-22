import { TriangleAlert } from 'lucide-react';

import ReturnButton from '@/components/return-button';

interface LoginErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function LoginErrorPage({
  searchParams,
}: LoginErrorPageProps) {
  const sp = await searchParams;
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6'>
      <ReturnButton href='/auth/login' label='Back to Login' />
      <div className='w-full max-w-xl bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-800'>Login Error</h1>
        <div className='flex items-center justify-center gap-2 text-red-600 font-semibold'>
          <TriangleAlert className='size-6 shrink-0' />
          <p className='text-lg'>
            {sp.error === 'account_not_linked'
              ? 'This account is already linked to another sign-in method.'
              : 'Oops! Something went wrong. Please try again.'}
          </p>
        </div>
      </div>
    </div>
  );
}
