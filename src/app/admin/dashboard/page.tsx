import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TriangleAlert, CircleCheckBig } from 'lucide-react';

import { auth } from '@/lib/auth';
import { UserRole } from '@/generated/prisma';

import ReturnButton from '@/components/return-button';
import DeleteUserButton, {
  PlaceholderDeleteButton,
} from '@/components/delete-user-button';
import UserRoleSelect from '@/components/user-role-select';

export default async function AdminDashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) redirect('/auth/login');

  if (session.user.role !== 'ADMIN') {
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

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: 'name',
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
    if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
    return 0;
  });

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
              {sortedUsers.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2'>{user.id.slice(0, 8)}</td>
                  <td className='px-4 py-2'>{user.name}</td>
                  <td className='px-4 py-2'>{user.email}</td>
                  <td className='px-4 py-2 text-center'>
                    <UserRoleSelect
                      userId={user.id}
                      role={user.role as UserRole}
                    />
                  </td>
                  <td className='px-4 py-2 text-center'>
                    {user.role === 'USER' ? (
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
      </div>
    </div>
  );
}
