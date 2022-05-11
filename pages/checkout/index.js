import { PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ImageCard from '../../components/cards/ImageCard';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import BetterLink from '../../components/link/BetterLink';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';

CheckoutPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useUser();
    const { products, getTotalProducts, getTotal } = useCart();

    const [wishlistedProducts, setWishlistedProducts] = useState([]);
    const [loadingWishlistedProducts, setLoadingWishlistedProducts] =
        useState(true);

    useEffect(() => {
        const fetchWishlistedProducts = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('wishlisted_products')
                    .select('*')
                    .eq('user_id', user?.id);

                if (error) throw error;
                setWishlistedProducts(data);
            } catch (error) {
                toast.error(error.message);
            }
            setLoadingWishlistedProducts(false);
        };

        fetchWishlistedProducts();
    }, [user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 p-4 md:p-8 lg:p-16 gap-8">
            <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label={`Your cart (${getTotalProducts()})`} />
                <Divider />

                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={product.id} className="flex flex-col">
                            <div className="flex flex-row mb-4 justify-between">
                                <BetterLink
                                    href={`/outlets/${product.outlet_id}/products/${product.id}`}
                                    className="rounded-lg p-2 hover:bg-blue-50 mr-4 w-full flex items-center space-x-2 transition duration-300"
                                >
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
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">
                                            {product.name} (x{product.quantity})
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                </BetterLink>

                                <div className="text-right flex flex-col justify-center space-y-2">
                                    <span className="text-sm font-bold">
                                        {formatCurrency(
                                            product.quantity * product.price
                                        )}
                                    </span>
                                </div>
                            </div>

                            {index !== products.length - 1 && <Divider />}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col space-y-4 items-center">
                        <p className="text-center text-zinc-600 dark:text-zinc-400">
                            You don&apos;t have any items in your cart.
                        </p>

                        <BetterLink
                            href="/"
                            className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <div>Browse products</div>
                        </BetterLink>
                    </div>
                )}
            </div>

            <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Order summary" />
                <Divider />

                <div>
                    <div className="flex flex-row justify-between items-center">
                        <span className="text-sm font-semibold">Subtotal</span>
                        <span className="text-sm font-bold">
                            {formatCurrency(getTotal())}
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <span className="text-sm font-semibold">
                            Shipping fees
                        </span>
                        <span className="text-sm font-bold">
                            {formatCurrency(0)}
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                        <span className="text-sm font-semibold">
                            Estimated Sale Tax
                        </span>
                        <span className="text-sm font-bold">
                            {formatCurrency(0)}
                        </span>
                    </div>
                </div>
                <Divider />

                <div className="flex flex-row justify-between items-center">
                    <Title className="text-sm font-semibold">Total</Title>
                    <Title className="text-sm font-bold">
                        {formatCurrency(getTotal())}
                    </Title>
                </div>

                <div className="mt-4 space-y-2">
                    <button
                        className="w-full rounded-lg bg-yellow-300/20 dark:bg-yellow-300/20 dark:hover:bg-yellow-400/40 hover:bg-yellow-300/30 text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-200 px-4 py-2 font-semibold transition duration-300"
                        onClick={() => {}}
                    >
                        Checkout
                    </button>

                    <button
                        className="w-full rounded-lg bg-blue-300/20 dark:bg-blue-300/20 dark:hover:bg-blue-400/40 hover:bg-blue-300/30 text-blue-600 dark:text-blue-300 dark:hover:text-blue-200 px-4 py-2 font-semibold transition duration-300"
                        onClick={() => {
                            router.push('/');
                        }}
                    >
                        Continue shopping
                    </button>
                </div>
            </div>

            <div className="col-span-full bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Your wishlist" />
                <Divider />

                <div>
                    {loadingWishlistedProducts ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : wishlistedProducts && wishlistedProducts.length > 0 ? (
                        wishlistedProducts.map((product) => (
                            <div key={product.user_id + product.product_id}>
                                {JSON.stringify(product)}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any items in your wishlist.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
