import { supabase } from '../../utils/supabase-client';
import { toast } from 'react-toastify';
import LoadingIndicator from '../common/LoadingIndicator';
import { useModals } from '@mantine/modals';

export default function AdminsTable({ admins, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const revokeAdmin = async (adminId) => {
        try {
            const { error } = await supabase
                .from('admins')
                .delete()
                .eq('user_id', adminId)
                .single();

            if (error) throw error;

            setter(admins.filter((admin) => admin.users.id !== adminId));
            toast.success('Admin access revoked successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showRevokeAdminModal = async (id, email) => {
        modals.openModal({
            title: <div className="font-bold">Revoke admin access</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div>
                    <div className="text-center">
                        <p className="text-lg">
                            Are you sure you want to revoke admin access for{' '}
                            <strong className="font-semibold">{email}</strong>?
                        </p>
                    </div>

                    <div className="flex items-center justify-end mt-4 space-x-2">
                        <button
                            className="w-fit rounded-lg bg-zinc-300/20 dark:bg-zinc-300/20 dark:hover:bg-zinc-400/40 hover:bg-zinc-300/30 text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200 px-4 py-1 font-semibold transition duration-300 text-center mb-2"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="w-fit rounded-lg bg-red-300/20 dark:bg-red-300/20 dark:hover:bg-red-400/40 hover:bg-red-300/30 text-red-600 dark:text-red-300 dark:hover:text-red-200 px-4 py-1 font-semibold transition duration-300 text-center mb-2"
                            onClick={() => revokeAdmin(id)}
                        >
                            Revoke
                        </button>
                    </div>
                </div>
            ),
        });
    };

    return loading ? (
        <div className="text-center">
            <LoadingIndicator svgClassName="w-8 h-8" />
        </div>
    ) : admins && admins.length > 0 ? (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-zinc-200 dark:border-zinc-700 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                            <thead className="bg-white dark:bg-zinc-800/50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        User ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Phone number
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Birthday
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Gender
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative px-6 py-3"
                                    >
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-800/50 divide-y divide-zinc-200 dark:divide-zinc-700">
                                {admins?.map((user) => (
                                    <tr key={user?.users?.email}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    {user?.users?.avatar_url ? (
                                                        <div className="aspect-square rounded-lg">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                className="h-10 w-10 rounded-lg"
                                                                src={
                                                                    user?.users
                                                                        ?.avatar_url
                                                                }
                                                                alt={
                                                                    user?.users
                                                                        ?.email
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 w-10 aspect-square bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                                                        {user?.users?.name ||
                                                            '-'}
                                                    </div>
                                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        {user?.users?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {user?.users?.id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {user?.users?.phone_number ||
                                                    '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {user?.users?.birthday
                                                    ? new Date(
                                                          user?.users?.birthday
                                                      ).toLocaleDateString(
                                                          'en-US',
                                                          {
                                                              month: 'long',
                                                              day: 'numeric',
                                                              year: 'numeric',
                                                          }
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user?.users?.gender ? (
                                                user?.users?.gender ==
                                                'male' ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-300/20 text-blue-800 dark:text-blue-300">
                                                        Male
                                                    </span>
                                                ) : user?.users?.gender ==
                                                  'female' ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-300/20 text-red-800 dark:text-red-300">
                                                        Female
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-300/20 text-purple-800 dark:text-purple-300">
                                                        Other
                                                    </span>
                                                )
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-red-300/20 dark:bg-red-300/20 dark:hover:bg-red-400/40 hover:bg-red-300/30 text-red-600 dark:text-red-300 dark:hover:text-red-200 px-4 py-1 font-semibold transition duration-300 text-center mb-2"
                                                onClick={() =>
                                                    showRevokeAdminModal(
                                                        user?.users?.id,
                                                        user?.users?.email
                                                    )
                                                }
                                            >
                                                Revoke admin
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="col-span-full flex flex-col space-y-4 items-center">
            <p className="text-center text-zinc-600 dark:text-zinc-400">
                No admins found.
            </p>
        </div>
    );
}
