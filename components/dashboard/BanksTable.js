import LoadingIndicator from '../common/LoadingIndicator';
import { getRelativeTime } from '../../utils/date-format';
import { supabase } from '../../utils/supabase-client';
import EditBankForm from '../forms/EditBankForm';
import { useModals } from '@mantine/modals';
import { toast } from 'react-toastify';

export default function BanksTable({ banks, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const editBank = async (bank) => {
        try {
            if (!bank) throw new Error("Bank doesn't exist");

            // get non-null values
            const newBank = {
                ...Object.fromEntries(
                    Object.entries(bank).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('banks')
                .update(newBank)
                .eq('code', bank.code)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (bank) => bank.code === newBank.code
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Bank updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const deleteBank = async (bankCode) => {
        try {
            const { error } = await supabase
                .from('banks')
                .delete()
                .eq('code', bankCode)
                .single();

            if (error) throw error;

            setter((prevState) =>
                prevState.filter((bank) => bank.code !== bankCode)
            );
            toast.success('Bank deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showEditBankModal = (bank) =>
        modals.openModal({
            title: <div className="font-bold">Edit bank</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditBankForm
                        bank={bank}
                        closeModal={closeModal}
                        onCreate={(bank) => editBank(bank)}
                        onDelete={() => deleteBank(bank?.code)}
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
                                        Code
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
                                        Short name
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
                                {banks.map((bank) => (
                                    <tr key={bank.code}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {bank?.code || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {bank?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {bank?.short_name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {bank?.created_at
                                                    ? getRelativeTime(
                                                          bank?.created_at
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showEditBankModal(bank)
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
