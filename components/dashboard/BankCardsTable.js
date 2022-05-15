import LoadingIndicator from '../common/LoadingIndicator';
import { getRelativeTime } from '../../utils/date-format';
import { useModals } from '@mantine/modals';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import EditCardForm from '../forms/EditCardForm';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';

export default function BankCardsTable({ bankCards, loading, setter }) {
    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const editCard = async (card) => {
        try {
            if (!card) throw new Error("Card doesn't exist");

            // get non-null values
            const newCard = {
                ...Object.fromEntries(
                    Object.entries(card).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('bank_cards')
                .update(newCard)
                .eq('bank_code', card.bank_code)
                .eq('card_number', card.card_number)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (card) => card.code === newCard.code
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Card updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const deleteCard = async (bankCode, cardNumber) => {
        try {
            const { error } = await supabase
                .from('bank_cards')
                .delete()
                .eq('bank_code', bankCode)
                .eq('card_number', cardNumber)
                .single();

            if (error) throw error;

            setter((prevState) =>
                prevState.filter(
                    (card) =>
                        card.card_number !== cardNumber ||
                        card.bank_code !== bankCode
                )
            );
            toast.success('Card deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showEditCardModal = (card) =>
        modals.openModal({
            title: <div className="font-bold">Edit card</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditCardForm
                        card={card}
                        closeModal={closeModal}
                        onCreate={(card) => editCard(card)}
                        onDelete={() =>
                            deleteCard(card?.bank_code, card?.card_number)
                        }
                    />
                </div>
            ),
            onClose: () => {},
        });

    const showCardPINModal = (card) =>
        modals.openModal({
            title: (
                <div className="font-bold">
                    {card.card_number.replace(/(\d{4})/g, '$1 ')}
                </div>
            ),
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="text-xl font-bold">{card.PIN}</div>
                            <button
                                className="flex items-center justify-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={() => {
                                    copyToClipboard(card.PIN);
                                }}
                            >
                                <ClipboardCopyIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-sm">Please keep it safe.</div>
                    </div>
                </div>
            ),
            onClose: () => {},
        });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

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
                                        Bank Code
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
                                    >
                                        Card Number
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
                                {bankCards.map((card) => (
                                    <tr
                                        key={card?.bank_code + card.card_number}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {card?.bank_code || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {card?.card_number
                                                    ?.replace(/(\d{4})/g, '$1 ')
                                                    ?.trim() || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {card?.owner_id || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-900 dark:text-zinc-200">
                                                {card?.created_at
                                                    ? getRelativeTime(
                                                          card?.created_at
                                                      )
                                                    : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-x-2 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="w-fit rounded-lg bg-blue-300/20 dark:bg-blue-300/20 dark:hover:bg-blue-400/40 hover:bg-blue-300/30 text-blue-600 dark:text-blue-300 dark:hover:text-blue-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showCardPINModal(card)
                                                }
                                            >
                                                View PIN
                                            </button>
                                            <button
                                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-4 py-1 font-semibold transition duration-300 text-center"
                                                onClick={() =>
                                                    showEditCardModal(card)
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
