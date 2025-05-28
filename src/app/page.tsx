import Image from 'next/image';
import GetStartedButton from '@/components/get-started-button';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 flex flex-col items-center justify-center px-6 py-16 text-center'>
      <Image
        src='/better-auth-logo.png'
        alt='Better-Auth Logo'
        width={120}
        height={120}
        className='rounded-full shadow-lg'
      />

      <h1 className='mt-8 text-5xl font-extrabold text-indigo-600'>
        Better Auth Example
      </h1>

      <p className='mt-4 max-w-xl text-indigo-700 text-lg leading-relaxed mb-8'>
        A powerful, secure, and easy-to-use authentication solution for modern
        apps. Built with Next.js and TypeScript — designed for speed, security,
        and developer happiness.
      </p>

      <GetStartedButton />

      <section className='mt-20 max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-left'>
        <FeatureCard
          title='Simple Integration'
          description='Plug Better Auth into your app with just a few lines of code. No hassle, no complex setup.'
          icon={
            <svg
              className='w-10 h-10 text-indigo-600'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              viewBox='0 0 24 24'
            >
              <path d='M12 5v14M5 12h14' />
            </svg>
          }
        />

        <FeatureCard
          title='Role-Based Access'
          description='Easily manage user roles and permissions like USER, ADMIN, and SUPER_ADMIN.'
          icon={
            <svg
              className='w-10 h-10 text-indigo-600'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              viewBox='0 0 24 24'
            >
              <circle cx='12' cy='7' r='4' />
              <path d='M5.5 21a6.5 6.5 0 0113 0' />
            </svg>
          }
        />

        <FeatureCard
          title='Secure & Reliable'
          description='Uses best security practices including password hashing, session management, and server-side validation.'
          icon={
            <svg
              className='w-10 h-10 text-indigo-600'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              viewBox='0 0 24 24'
            >
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0110 0v4' />
            </svg>
          }
        />
      </section>

      <section className='mt-20 max-w-3xl text-indigo-800 text-sm italic'>
        This app is an <strong>open-source demo example</strong> showcasing how
        to build a modern auth system using Better Auth and Next.js.
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='flex flex-col items-start gap-4 p-6 bg-white rounded-xl shadow-md'>
      <div>{icon}</div>
      <h3 className='text-xl font-semibold'>{title}</h3>
      <p className='text-indigo-600'>{description}</p>
    </div>
  );
}
