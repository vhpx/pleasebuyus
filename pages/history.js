import { CollectionIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Divider from '../components/common/Divider';
import LoadingIndicator from '../components/common/LoadingIndicator';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';
import BetterLink from '../components/link/BetterLink';
import { RequireAuth, useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/currency-format';
import { getRelativeTime } from '../utils/date-format';
import { supabase } from '../utils/supabase-client';

PurchaseHistoryPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function PurchaseHistoryPage() {
    RequireAuth();

    const router = useRouter();
    const { user } = useUser();

    const navigateToBrowseItems = () => {
        router.push('/');
    };

    const [purchases, setPurchases] = useState([]);
    const [loadingPurchases, setLoadingPurchases] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!user)
                    throw new Error(
                        'You must be logged in to view your purchase history.'
                    );

                const { data, error } = await supabase
                    .from('bills')
                    .select(
                        'id, total, outlets (*), addresses (*), user_cards (*), bill_products (*), created_at'
                    )
                    .eq('customer_id', user.id)
                    .order('created_at', {
                        ascending: false,
                    });

                if (error) throw error;
                setPurchases(data);
            } catch (error) {
                toast.error(error);
            } finally {
                setLoadingPurchases(false);
            }
        };

        fetchHistory();
    }, [user]);

    const getAddress = (address) => {
        if (!address) return null;

        const { country, province, city, street_info } = address;

        const infos = [street_info, city, province, country].filter(
            (info) => info
        );

        return infos.join(', ');
    };

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Purchase History" />
                <Divider />

                <div className="grid grid-cols-1 gap-6">
                    {loadingPurchases ? (
                        <div className="w-full text-center col-span-full">
                            <LoadingIndicator svgClassName="h-8 w-8" />
                        </div>
                    ) : purchases && purchases.length > 0 ? (
                        purchases.map((purchase, index) => (
                            <BetterLink
                                key={purchase.id}
                                href={`/bills/${purchase.id}`}
                                className="flex flex-col lg:flex-row p-2 md:p-4 gap-4 hover:bg-blue-50/50 dark:hover:bg-zinc-800 rounded-lg"
                            >
                                {purchase?.outlets?.avatar_url ? (
                                    <div className="aspect-square rounded-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            className="aspect-square rounded-lg mb-2"
                                            src={purchase?.outlets.avatar_url}
                                            alt={purchase?.outlets.name}
                                            height={400}
                                            width={400}
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square w-full bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
                                )}

                                <div className="w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 mb-2">
                                        <div>
                                            <div className="text-xl lg:text-2xl font-semibold">
                                                {purchase.outlets.name}{' '}
                                                <span className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                                                    ({purchase.id})
                                                </span>
                                            </div>
                                            <div>
                                                {getRelativeTime(
                                                    purchase.created_at
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Card
                                                className="flex items-center space-x-2 w-fit"
                                                disableHoverEffect
                                            >
                                                <div>
                                                    {purchase?.user_cards?.card_number
                                                        ?.replace(
                                                            /(\d{4})/g,
                                                            '$1 '
                                                        )
                                                        ?.trim()}
                                                </div>
                                                <div className="text-sm font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                                    {
                                                        purchase.user_cards
                                                            .bank_code
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-2 py-1 font-semibold transition duration-300 text-center mb-2">
                                            {purchase.bill_products.reduce(
                                                (acc, product) => {
                                                    return acc + product.amount;
                                                },
                                                0
                                            ) +
                                                ' ' +
                                                (purchase.bill_products.reduce(
                                                    (acc, product) => {
                                                        return (
                                                            acc + product.amount
                                                        );
                                                    },
                                                    0
                                                ) > 1
                                                    ? ' Items'
                                                    : 'Item')}
                                        </div>

                                        <div className="font-bold text-lg md:text-2xl">
                                            {formatCurrency(purchase.total)}
                                        </div>
                                    </div>
                                    <div className="font-semibold text-lg">
                                        Ship to:{' '}
                                        <span className="font-normal text-blue-500 dark:text-blue-300 text-base">
                                            {getAddress(purchase.addresses)}
                                        </span>
                                    </div>

                                    {index !== purchases.length - 1 && (
                                        <Divider />
                                    )}
                                </div>
                            </BetterLink>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any purchases yet.
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={navigateToBrowseItems}
                            >
                                <CollectionIcon className="w-4 h-4" />
                                <div>Browse products</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
