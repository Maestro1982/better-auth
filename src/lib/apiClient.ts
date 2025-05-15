import { signUp } from '@/lib/auth-client';

export type SignUpEmailInput = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export async function signUpEmail(input: SignUpEmailInput): Promise<User> {
  const response = await signUp.email(input);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data?.user) {
    throw new Error('No user returned from sign up');
  }

  return response.data.user;
}
