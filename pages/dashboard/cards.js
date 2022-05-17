import Title from '../../components/common/Title.js';
import BankCardsTable from '../../components/dashboard/BankCardsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PlusIcon } from '@heroicons/react/outline';
import { supabase } from '../../utils/supabase-client.js';
import EditCardForm from '../../components/forms/EditCardForm.js';
import { useModals } from '@mantine/modals';

ChartJS.register(ArcElement, Tooltip, Legend);

BankCardsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BankCardsDashboardPage() {
    RequireAuth();

    const router = useRouter();
    const modals = useModals();

    const closeModal = () => modals.closeModal();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBankCards = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('bank_cards')
                    .select('*, users (name, email)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setCards(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBankCards();
    }, []);

    const addCard = async (card) => {
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

            delete newCard.id;

            const { data, error } = await supabase
                .from('bank_cards')
                .insert(newCard)
                .single();

            if (error) throw error;

            setCards((cards) => [...cards, data]);
            toast.success('Card added successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showCreateCardModal = (card) =>
        modals.openModal({
            title: <div className="font-bold">Create new card</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditCardForm
                        card={card}
                        closeModal={closeModal}
                        onCreate={(card) => addCard(card)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const getDistinctCards = () => {
        return cards.reduce((acc, card) => {
            if (acc.includes(card.bank_code)) return acc;
            return [...acc, card.bank_code];
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {cards && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctCards(),
                                    datasets: [
                                        {
                                            label: 'Bank Cards',
                                            data: [
                                                // For each country, count the number of addresses
                                                ...getDistinctCards().map(
                                                    (bankCode) =>
                                                        cards.reduce(
                                                            (acc, card) =>
                                                                card.bank_code ==
                                                                bankCode
                                                                    ? acc + 1
                                                                    : acc,
                                                            0
                                                        )
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Bank popularity
                            </div>
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

            <div className="flex mb-4">
                <Title label="Bank Cards" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={showCreateCardModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <BankCardsTable
                bankCards={cards}
                loading={loading}
                setter={setCards}
            />
        </div>
    ) : (
        <div></div>
    );
}
