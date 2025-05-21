import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TriangleAlert, CircleCheckBig } from 'lucide-react';

import { auth } from '@/lib/auth';

import ReturnButton from '@/components/return-button';
import DeleteUserButton, {
  PlaceholderDeleteButton,
} from '@/components/delete-user-button';

export default async function AdminDashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect('/auth/login');

  if (session.user.role !== 'ADMIN') {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4'>
        <ReturnButton href='/profile' label='Profile' />
        <div className='w-full max-w-md space-y-6 text-center border border-black rounded-lg p-6'>
          <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
          <p className='p-2 rounded-md text-lg bg-red-600 text-white font-bold uppercase flex items-center justify-center gap-2'>
            <TriangleAlert className='size-6' />
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
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <ReturnButton href='/profile' label='Profile' />
      <div className='w-full max-w-4xl space-y-6 text-center border border-black rounded-lg p-6'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <p className='p-2 rounded-md text-lg bg-green-600 text-white font-bold uppercase flex items-center justify-center gap-2'>
          <CircleCheckBig className='size-6' />
          Access Granted
        </p>
        <div className='w-full overflow-x-auto'>
          <table className='table-auto min-w-full whitespace-nowrap text-left'>
            <thead>
              <tr className='border-b text-sm text-left'>
                <th className='px-2 py-2'>ID</th>
                <th className='px-2 py-2'>Name</th>
                <th className='px-2 py-2'>Email</th>
                <th className='px-2 py-2 text-center'>Role</th>
                <th className='px-2 py-2 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className='border-b text-sm text-left'>
                  <td className='px-4 py-2'>{user.id.slice(0, 8)}</td>
                  <td className='px-4 py-2'>{user.name}</td>
                  <td className='px-4 py-2'>{user.email}</td>
                  <td className='px-4 py-2 text-center'>{user.role}</td>
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
