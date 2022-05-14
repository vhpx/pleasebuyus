import Title from '../../components/common/Title.js';
import BankCardsTable from '../../components/dashboard/BankCardsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Divider } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

BankCardsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BankCardsDashboardPage() {
    RequireAuth();

    const router = useRouter();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    const [cards, setCards] = useState(null);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

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
                    <Title label="Charts" className="mb-4" />
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
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="my-4" />
                </>
            )}

            <Title label="Bank Cards" className="mb-4" />
            <BankCardsTable setter={setCards} />
        </div>
    ) : (
        <div></div>
    );
}
