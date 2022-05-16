import { toast } from 'react-toastify';
import LoadingIndicator from '../common/LoadingIndicator';
import { getRelativeTime } from '../../utils/date-format';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client';
import EditOutletForm from '../forms/EditOutletForm';

export default function OutletsTable({ outlets, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const editOutlet = async (outlet) => {
        try {
            if (!outlet) throw new Error("Outlet doesn't exist");

            // get non-null values
            const newOutlet = {
                ...Object.fromEntries(
                    Object.entries(outlet).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('outlets')
                .update(newOutlet)
                .eq('id', outlet.id)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (outlet) => outlet.id === newOutlet.id
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Outlet updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const deleteOutlet = async (outletId) => {
        try {
            const { error } = await supabase
                .from('outlets')
                .delete()
                .eq('id', outletId)
                .single();

            if (error) throw error;

            setter((prevState) =>
                prevState.filter((outlet) => outlet.id !== outletId)
            );
            toast.success('Outlet deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showEditOutletModal = (outlet) =>
        modals.openModal({
            title: <div className="font-bold">Edit outlet</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditOutletForm
                        outlet={outlet}
                        closeModal={closeModal}
                        onCreate={(outlet) => editOutlet(outlet)}
                        onDelete={() => deleteOutlet(outlet?.id)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    return loading ? (
        <div className="text-center">
            <LoadingIndicator svgClassName="w-8 h-8" />
        </div>
    ) : (
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
                                        ID
                                    </th>
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
                                        Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Owner ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Creation Date
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
                                {outlets.map((outlet) => (
                                    <tr key={outlet.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {outlet?.id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {outlet?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {outlet?.address || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {outlet?.users?.name ||
                                                    outlet?.users?.email ||
                                                    '-'}
                                            </div>
                                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                                                {outlet?.owner_id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {outlet?.created_at
                                                    ? getRelativeTime(
                                                          outlet?.created_at
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showEditOutletModal(outlet)
                                                }
                                            >
                                                Edit
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
    );
}
