import Title from '../../components/common/Title.js';
import TransactionsTable from '../../components/dashboard/TransactionsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

TransactionsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function TransactionsDashboardPage() {
    RequireAuth();

    const router = useRouter();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

    const getDistinctOutlets = () => {
        return transactions.reduce((acc, transaction) => {
            if (acc.includes(transaction.outlets.name)) return acc;
            return [...acc, transaction.outlets.name];
        }, []);
    };

    const getDistinctUsers = () => {
        return transactions.reduce((acc, transaction) => {
            if (acc.includes(transaction.users.email)) return acc;
            return [...acc, transaction.users.email];
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {transactions && (
                <>
                    <Title label="Charts" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: [
                                        'Less than $5',
                                        '$5 - $20',
                                        '$20 - $50',
                                        '$50 - $100',
                                        '$100 - $500',
                                        '$500+',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Total',
                                            data: [
                                                transactions.filter(
                                                    (product) =>
                                                        product.total < 5
                                                ).length,
                                                transactions.filter(
                                                    (product) =>
                                                        product.total >= 5 &&
                                                        product.total < 20
                                                ).length,
                                                transactions.filter(
                                                    (product) =>
                                                        product.total >= 20 &&
                                                        product.total < 50
                                                ).length,
                                                transactions.filter(
                                                    (product) =>
                                                        product.total >= 50 &&
                                                        product.total < 100
                                                ).length,
                                                transactions.filter(
                                                    (product) =>
                                                        product.total >= 100 &&
                                                        product.total < 500
                                                ).length,
                                                transactions.filter(
                                                    (product) =>
                                                        product.total >= 500
                                                ).length,
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
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctOutlets(),
                                    datasets: [
                                        {
                                            label: 'Outlets',
                                            data: getDistinctOutlets().map(
                                                (outlet) =>
                                                    transactions.filter(
                                                        (transaction) =>
                                                            transaction.outlets
                                                                .name === outlet
                                                    ).length
                                            ),
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
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctUsers(),
                                    datasets: [
                                        {
                                            label: 'Users',
                                            data: getDistinctUsers().map(
                                                (user) =>
                                                    transactions.filter(
                                                        (transaction) =>
                                                            transaction.users
                                                                .email === user
                                                    ).length
                                            ),
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
                        </div>
                    </div>
                    <div className="my-4" />
                </>
            )}

            <Title label="Transactions" className="mb-4" />
            <TransactionsTable setter={setTransactions} />
        </div>
    ) : (
        <div></div>
    );
}
