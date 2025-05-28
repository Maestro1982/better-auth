import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TriangleAlert, CircleCheckBig } from 'lucide-react';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserRole } from '@/generated/prisma';

import ReturnButton from '@/components/return-button';
import DeleteUserButton, {
  PlaceholderDeleteButton,
} from '@/components/delete-user-button';
import UserRoleSelect from '@/components/user-role-select';

import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) redirect('/auth/login');

  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6'>
        <ReturnButton href='/profile' label='Back to Profile' />
        <div className='w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6 text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
          <p className='flex items-center justify-center gap-2 p-3 rounded-md bg-red-600 text-white font-semibold uppercase'>
            <TriangleAlert className='size-5' />
            Access Denied
          </p>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  // Sort by role manually
  const sortedUsers = users.sort((a, b) => {
    const roleOrder = {
      SUPER_ADMIN: 0,
      ADMIN: 1,
      USER: 2,
    };

    return roleOrder[a.role] - roleOrder[b.role];
  });

  // Pagination logic after sorting
  const pageSize = 5;

  let currentPage = parseInt(searchParams?.page ?? '1', 10);
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const paginatedUsers = sortedUsers.slice(start, start + pageSize);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center p-6'>
      <ReturnButton href='/profile' label='Back to Profile' />
      <div className='w-full max-w-5xl bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6'>
        <h1 className='text-4xl font-extrabold text-gray-800 text-center'>
          Admin Dashboard
        </h1>
        <p className='flex items-center justify-center gap-2 p-3 rounded-md bg-green-600 text-white font-semibold uppercase'>
          <CircleCheckBig className='size-5' />
          Access Granted
        </p>

        <div className='w-full overflow-x-auto'>
          <table className='min-w-full table-auto text-sm text-left border border-gray-300 rounded-md overflow-hidden'>
            <thead className='bg-gray-200'>
              <tr className='text-gray-700 uppercase text-xs tracking-wider'>
                <th className='px-4 py-3'>ID</th>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3 text-center'>Role</th>
                <th className='px-4 py-3 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2'>{user.id.slice(0, 8)}</td>
                  <td className='px-4 py-2'>{user.name}</td>
                  <td className='px-4 py-2'>{user.email}</td>
                  <td className='px-4 py-2 text-center'>
                    <UserRoleSelect
                      userId={user.id}
                      role={user.role as UserRole}
                      currentUserId={session.user.id}
                    />
                  </td>
                  <td className='px-4 py-2 text-center'>
                    {(session.user.role === 'SUPER_ADMIN' &&
                      user.role !== 'SUPER_ADMIN') ||
                    user.role === 'USER' ? (
                      <DeleteUserButton userId={user.id} />
                    ) : (
                      <PlaceholderDeleteButton />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-between items-center mt-6'>
          {currentPage <= 1 ? (
            <Button disabled>Previous</Button>
          ) : (
            <Button asChild>
              <Link href={`?page=${currentPage - 1}`}>Previous</Link>
            </Button>
          )}

          <span className='text-gray-600 text-sm'>
            Page {currentPage} of {totalPages}
          </span>

          {currentPage >= totalPages ? (
            <Button disabled>Next</Button>
          ) : (
            <Button asChild>
              <Link href={`?page=${currentPage + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
