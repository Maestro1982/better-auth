'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { changePasswordAction } from '@/actions/change-password-action';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Define validation schema
const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof schema>;

const ChangePasswordForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);

    try {
      const result = await changePasswordAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Password changed successfully');
        reset();
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to change password');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-sm w-full space-y-4'
    >
      <div className='flex flex-col gap-2'>
        <Label htmlFor='currentPassword'>Current Password</Label>
        <Input
          id='currentPassword'
          type='password'
          {...register('currentPassword')}
        />
        {errors.currentPassword && (
          <p className='text-sm text-red-500'>
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='newPassword'>New Password</Label>
        <Input id='newPassword' type='password' {...register('newPassword')} />
        {errors.newPassword && (
          <p className='text-sm text-red-500'>{errors.newPassword.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='confirmNewPassword'>Confirm New Password</Label>
        <Input
          id='confirmNewPassword'
          type='password'
          {...register('confirmNewPassword')}
        />
        {errors.confirmNewPassword && (
          <p className='text-sm text-red-500'>
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
