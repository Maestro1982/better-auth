'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateUser } from '@/lib/auth-client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image: z.string().optional(),
});

type UpdateUserFormValues = z.infer<typeof schema>;

interface UpdateUserFormProps {
  name: string;
  image: string;
}

const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
      image,
    },
  });

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      await updateUser({
        ...data,
        fetchOptions: {
          onSuccess: () => {
            toast.success('User updated successfully');
            reset();
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update user');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-sm w-full space-y-4'
    >
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' {...register('name')} />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='image'>Image (URL)</Label>
        <Input type='url' id='image' {...register('image')} />
        {errors.image && (
          <p className='text-sm text-red-500'>{errors.image.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update User'}
      </Button>
    </form>
  );
};

export default UpdateUserForm;
