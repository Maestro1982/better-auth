import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

type SignUpEmailInput = Parameters<typeof auth.api.signUpEmail>[0];

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findFirst({ where: { name } });
    if (existingUser) {
      return NextResponse.json(
        { error: { message: 'This name is already taken.' } },
        { status: 409 }
      );
    }

    const user = await auth.api.signUpEmail({
      body: { name, email, password },
      method: 'POST',
    } as SignUpEmailInput);

    return NextResponse.json({ user });
  } catch (error) {
    // Log error server-side for debugging
    console.error('Registration error:', error);

    // Always respond with JSON error
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
