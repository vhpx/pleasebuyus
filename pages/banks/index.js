import {
    ClipboardCopyIcon,
    LockClosedIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { BankLayout } from '../../components/layout/layout';
import Title from '../../components/typography/Title';
import { useUser } from '../../hooks/useUser';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client';
import CreateBankCardForm from '../../components/forms/CreateBankCardForm';

BanksPage.getLayout = (page) => {
    return <BankLayout>{page}</BankLayout>;
};

export default function BanksPage() {
    const { userData } = useUser();

    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const { data, error } = await supabase
                    .from('banks')
                    .select('*');

                if (error) throw error;

                setBanks(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingBanks(false);
            }
        };

        const fetchCards = async () => {
            if (!userData) return;

            try {
                const { data, error } = await supabase
                    .from('bank_cards')
                    .select('*')
                    .eq('owner_id', userData.id);

                if (error) throw error;

                setCards(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingCards(false);
            }
        };

        fetchBanks();
        fetchCards();
    }, [userData]);

    const openNewCard = async (bank) => {
        if (!userData) {
            toast.error('You must be logged in to create a bank card');
            return;
        }

        if (!bank || bank == 'Select a bank') {
            toast.error('You must select a bank');
            return;
        }

        // Generate a new card number with the following format:
        // ****-****-****-****
        const cardNumber = Math.floor(Math.random() * 9999999999999999)
            .toString()
            .padStart(16, '0');

        // Generate a new card PIN with the following format:
        // ****
        const cardPin = Math.floor(Math.random() * 9999)
            .toString()
            .padStart(4, '0');

        try {
            const { data, error } = await supabase
                .from('bank_cards')
                .insert({
                    bank_code: bank,
                    card_number: cardNumber,
                    PIN: cardPin,
                    owner_id: userData.id,
                })
                .single();

            if (error) throw error;

            setCards((prevCards) => [...prevCards, data]);
            toast.success('Card created successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteCard = async (card) => {
        if (!userData) {
            toast.error('You must be logged in to delete a bank card');
            return;
        }

        if (!card) {
            toast.error('You must select a card');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('bank_cards')
                .delete()
                .eq('owner_id', userData.id)
                .eq('bank_code', card.bank_code)
                .eq('card_number', card.card_number)
                .single();

            if (error || !data) throw error;
            const { bank_code, card_number } = data;

            setCards((prevCards) =>
                prevCards.filter(
                    (c) =>
                        !(
                            c.bank_code === bank_code &&
                            c.card_number === card_number
                        )
                )
            );
            toast.success('Card deleted successfully');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openCardCreationModal = () =>
        modals.openModal({
            title: <div className="font-bold">Open a new Card</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <CreateBankCardForm
                        banks={banks}
                        holderName={userData?.name || userData?.email}
                        closeModal={closeModal}
                        onCreate={(bank) => openNewCard(bank)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const openCardPINModal = (card) =>
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
                        <div className="text-sm">
                            This is your card PIN. Please keep it safe.
                        </div>
                    </div>
                </div>
            ),
            onClose: () => {},
        });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            {userData && (
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <div className="flex">
                        <Title label="Your cards"></Title>
                        <button
                            className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                            onClick={openCardCreationModal}
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <Divider />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loadingCards ? (
                            <div className="col-span-full text-center">
                                <LoadingIndicator svgClassName="w-8 h-8" />
                            </div>
                        ) : cards && cards.length > 0 ? (
                            cards.map((card) => (
                                <Card key={card.id} className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <div className="font-bold text-sm md:text-base lg:text-lg">
                                            {/* Card number should be:
                                             **** **** **** **** */}
                                            {card.card_number.replace(
                                                /(\d{4})/g,
                                                '$1 '
                                            )}
                                        </div>
                                        <button
                                            className="flex items-center justify-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                            onClick={() => {
                                                copyToClipboard(
                                                    card.card_number
                                                );
                                            }}
                                        >
                                            <ClipboardCopyIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Divider padding="my-2" />

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                            {card.bank_code}
                                        </div>
                                        <div className="text-sm font-semibold">
                                            {userData?.name || userData?.email}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-center flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
                                        <button
                                            className="w-full max-w-[16rem] self-center text-center flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                            onClick={() =>
                                                openCardPINModal(card)
                                            }
                                        >
                                            <div>View PIN</div>
                                            <LockClosedIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="w-full max-w-[16rem] self-center text-center flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                            onClick={() => deleteCard(card)}
                                        >
                                            <div>Delete Card</div>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col space-y-4 items-center">
                                <p className="text-center text-zinc-600 dark:text-zinc-400">
                                    You don&apos;t have any cards yet.
                                </p>

                                <button
                                    className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                    onClick={openCardCreationModal}
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <div>Add a card</div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Supported Banks" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loadingBanks ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : banks && banks.length > 0 ? (
                        banks.map((bank) => (
                            <Card
                                key={bank.id}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex space-x-2 items-center">
                                    <div className="font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                        {bank.code}
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {bank.short_name}
                                    </div>
                                </div>
                                <div>{bank.name}</div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                There are no banks yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
