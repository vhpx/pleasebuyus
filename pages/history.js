import { CollectionIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Divider from '../components/common/Divider';
import LoadingIndicator from '../components/common/LoadingIndicator';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';
import { RequireAuth, useUser } from '../hooks/useUser';
import { formatCurrency } from '../utils/currency-format';
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
                        'total, outlets (*), addresses (*), user_cards (*), bill_products (*), created_at'
                    )
                    .eq('customer_id', user.id);

                if (error) throw error;
                setPurchases(data);
                console.log(data);
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

    function myDateParse(s) {
        let b = s.split(/\D/);
        --b[1]; // Adjust month number
        b[6] = b[6].substr(0, 3); // Microseconds to milliseconds
        return new Date(Date.UTC(...b));
    }

    const getRelativeTime = (timestamptz) => {
        const now = new Date();
        const then = myDateParse(timestamptz);

        const diff = now.getTime() - then.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds <= 1) return 'just now';
        if (seconds < 60) return `${seconds} seconds ago`;

        if (minutes <= 1) return '1 minute ago';
        if (minutes < 60) return `${minutes} minutes ago`;

        if (hours <= 1) return '1 hour ago';
        if (hours < 24) return `${hours} hours ago`;

        if (days <= 1) return '1 day ago';
        if (days < 7) return `${days} days ago`;

        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

        if (days < 365) return `${Math.floor(days / 30)} months ago`;

        return `${Math.floor(days / 365)} years ago`;
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
                            <div key={purchase.id}>
                                <div className="text-xl lg:text-2xl font-semibold mb-2">
                                    {purchase.outlets.name}
                                </div>

                                <div>
                                    Card:{' '}
                                    {purchase?.user_cards?.card_number
                                        ?.replace(/(\d{4})/g, '$1 ')
                                        ?.trim()}{' '}
                                    ({purchase.user_cards.bank_code})
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        Address:{' '}
                                        {getAddress(purchase.addresses)}
                                    </div>

                                    <div>
                                        {getRelativeTime(purchase.created_at)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        {purchase.bill_products.length +
                                            ' ' +
                                            (purchase.bill_products.length > 1
                                                ? ' Items'
                                                : 'Item')}
                                    </div>

                                    <div>{formatCurrency(purchase.total)}</div>
                                </div>

                                {index !== purchases.length - 1 && <Divider />}
                            </div>
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
