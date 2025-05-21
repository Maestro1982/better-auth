import { NextResponse } from 'next/server';
import { APIError } from 'better-auth/api';

import { auth, ErrorCode } from '@/lib/auth';
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

    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      method: 'POST',
    } as SignUpEmailInput);

    return NextResponse.json({ user: result.user });
  } catch (error) {
    if (error instanceof APIError) {
      const errorCode = error.body ? (error.body.code as ErrorCode) : 'UNKNOWN';

      switch (errorCode) {
        default:
          return { error: error.message };
      }
    }
    // Log error server-side for debugging
    console.error('Registration error:', error);

    // Always respond with JSON error
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
