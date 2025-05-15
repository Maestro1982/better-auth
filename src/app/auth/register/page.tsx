import RegisterForm from '@/components/register-form';

export default function RegisterPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md space-y-6 text-center border border-black rounded-lg p-6'>
        <h1 className='text-3xl font-bold'>Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
