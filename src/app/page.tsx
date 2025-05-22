import Image from 'next/image';

import GetStartedButton from '@/components/get-started-button';

export default function Home() {
  return (
    <div className='flex items-center justify-center h-dvh'>
      <div className='flex flex-col items-center justify-center gap-8'>
        <Image
          src={'/better-auth-logo.png'}
          alt='Better-Auth Logo'
          width={100}
          height={100}
          className='rounded-full'
        />
        <h1 className='text-6xl font-bold'>Better-Auth</h1>
        <GetStartedButton />
      </div>
    </div>
  );
}
