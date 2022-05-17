import { CollectionIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import BetterLink from '../../components/link/BetterLink';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';

DetailedBillPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedBillPage() {
    RequireAuth();

    const router = useRouter();
    const { user } = useUser();

    const [purchase, setPurchase] = useState(null);
    const [loadingPurchase, setLoadingPurchase] = useState(true);

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [appliedCoupons, setAppliedCoupons] = useState(null);
    const [loadingCoupons, setLoadingCoupons] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!user)
                    throw new Error(
                        'You must be logged in to view your purchase history.'
                    );

                const billId = router?.query?.billId;
                if (!billId) return;

                const { data, error } = await supabase
                    .from('bills')
                    .select(
                        'id, total, users (*), outlets (*), addresses (*), user_cards (*), bill_products (*), created_at'
                    )
                    .eq('id', billId)
                    .single();

                if (error) throw error;
                setPurchase(data);
            } catch (error) {
                toast.error(error);
            } finally {
                setLoadingPurchase(false);
            }
        };

        fetchHistory();
    }, [user, router?.query]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!purchase) return;

                const { data, error } = await supabase
                    .from('bill_products')
                    .select('*, products (*)')
                    .eq('bill_id', purchase.id);

                if (error) throw error;

                const products = data.map((product) => ({
                    ...product.products,
                    quantity: product.amount,
                }));

                setProducts(products);
            } catch (error) {
                toast.error(error);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [purchase]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                if (!purchase) return;

                const { data, error } = await supabase
                    .from('bills')
                    .select('coupons (*)')
                    .eq('id', purchase.id);

                if (error) throw error;
                const coupons = data.map((coupon) => coupon.coupons);
                console.log('data', data);
                console.log('coupons', coupons);
                setAppliedCoupons(coupons);
            } catch (error) {
                toast.error(error);
            } finally {
                setLoadingCoupons(false);
            }
        };

        fetchCoupons();
    }, [purchase]);

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
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <OutlinedButton
                label="Back"
                widthConstraint="w-full md:max-w-[20rem]"
                onClick={() => router.back()}
            />

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title>
                    Bill ID:{' '}
                    <span className="font-bold text-purple-600 dark:text-purple-300">
                        {purchase?.id}
                    </span>
                </Title>
                <Divider />

                <div className="grid grid-cols-1 gap-6">
                    {loadingPurchase ? (
                        <div className="w-full text-center col-span-full">
                            <LoadingIndicator svgClassName="h-8 w-8" />
                        </div>
                    ) : purchase ? (
                        <div
                            key={purchase.id}
                            className="flex flex-col lg:flex-row gap-4 rounded-lg"
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
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square h-auto w-[400px] bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
                            )}

                            <div className="w-full">
                                <div className="grid grid-cols-1 lg:grid-cols-2 mb-2">
                                    <div>
                                        <div className="text-xl lg:text-2xl font-semibold">
                                            {purchase.outlets.name}
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
                                                    ?.replace(/(\d{4})/g, '$1 ')
                                                    ?.trim()}
                                            </div>
                                            <div className="text-sm font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                                {purchase.user_cards.bank_code}
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-2 py-1 font-semibold transition duration-300 text-center mb-2">
                                            {purchase.bill_products.length +
                                                ' ' +
                                                (purchase.bill_products.length >
                                                1
                                                    ? ' Items'
                                                    : 'Item')}
                                        </div>

                                        <div className="font-semibold text-lg">
                                            Ship to:{' '}
                                            <span className="font-normal text-blue-500 dark:text-blue-300 text-base">
                                                {getAddress(purchase.addresses)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-end space-y-2">
                                        <div className="font-bold text-lg md:text-2xl">
                                            {formatCurrency(purchase.total)}
                                        </div>

                                        {loadingCoupons ? (
                                            <div className="w-full text-center col-span-full">
                                                <LoadingIndicator svgClassName="h-8 w-8" />
                                            </div>
                                        ) : appliedCoupons &&
                                          appliedCoupons.length > 0 ? (
                                            <>
                                                <div className="font-semibold text-lg">
                                                    Applied Coupons:
                                                </div>
                                                {appliedCoupons.map(
                                                    (coupon) => (
                                                        <div
                                                            key={coupon.id}
                                                            className="flex items-center space-x-2 w-fit"
                                                        >
                                                            <div className="text-sm font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                                                {coupon.code} (
                                                                {(coupon.use_ratio
                                                                    ? `${coupon.value}%`
                                                                    : formatCurrency(
                                                                          coupon.value
                                                                      )) +
                                                                    ' discount'}
                                                                )
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full text-center col-span-full">
                                                <div className="text-sm font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                                    No Coupon Applied
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Divider className="mb-2" />
                                <div className="flex gap-4 justify-end">
                                    <div>
                                        <div className="text-right font-semibold text-purple-500 dark:text-blue-200/70">
                                            Purchased by
                                        </div>
                                        <div className="text-right text-xl lg:text-2xl font-semibold">
                                            {purchase?.users?.name || 'No Name'}
                                        </div>
                                        <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                                            {purchase?.users?.email ||
                                                'No Email'}
                                        </div>
                                    </div>

                                    {purchase?.users?.avatar_url ? (
                                        <div className="aspect-square h-32 w-32 rounded-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                className="aspect-square h-32 w-32 rounded-lg mb-2"
                                                src={purchase?.users.avatar_url}
                                                alt={purchase?.users.name}
                                                height={120}
                                                width={120}
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square h-32 w-32 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                Invaid purchase ID
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {loadingProducts ? (
                <div className="w-full text-center col-span-full">
                    <LoadingIndicator svgClassName="h-8 w-8" />
                </div>
            ) : products && products.length > 0 ? (
                products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg flex flex-col"
                    >
                        <div className="flex items-center mb-4 justify-between space-x-4">
                            <div className="rounded-lg p-2 w-full flex items-center space-x-2">
                                <div className="w-20 h-20">
                                    {product?.avatar_url ? (
                                        <div className="aspect-square rounded-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                className="aspect-square rounded-lg mb-2"
                                                src={product.avatar_url}
                                                alt={product.name}
                                                height={400}
                                                width={400}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square w-full bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
                                    )}
                                </div>

                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-bold">
                                        {product.name} (x
                                        {product.quantity})
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {formatCurrency(product.price)}
                                    </span>

                                    <BetterLink
                                        href={`/outlets/${product.outlet_id}/products/${product.id}`}
                                        className="mt-4 flex items-center font-semibold space-x-2 p-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                    >
                                        View product
                                    </BetterLink>
                                </div>
                            </div>

                            <div className="hidden text-right md:flex flex-col justify-center space-y-2">
                                <span className="text-sm font-bold">
                                    {formatCurrency(
                                        product.quantity * product.price
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg col-span-full items-center">
                    <p className="text-center text-zinc-600 dark:text-zinc-400">
                        You have no items in this purchase
                    </p>
                </div>
            )}
        </div>
    );
}
