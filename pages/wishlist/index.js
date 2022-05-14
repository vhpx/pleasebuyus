import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import BetterLink from '../../components/link/BetterLink';
import { useUser } from '../../hooks/useUser';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';

WishlistPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function WishlistPage() {
    const { user } = useUser();

    const [wishlistedProducts, setWishlistedProducts] = useState([]);
    const [loadingWishlistedProducts, setLoadingWishlistedProducts] =
        useState(true);

    useEffect(() => {
        const fetchWishlistedProducts = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('wishlisted_products')
                    .select('products (*)')
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

    const removeFromWishlist = async (productId) => {
        try {
            const { error } = await supabase
                .from('wishlisted_products')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (error) throw error;

            setWishlistedProducts((prevWishlistedProducts) =>
                prevWishlistedProducts.filter(
                    (wishlistedProduct) =>
                        wishlistedProduct.products.id !== productId
                )
            );

            toast.success('Product removed from wishlist');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Your wishlist" />
                <Divider />

                <div>
                    {loadingWishlistedProducts ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : wishlistedProducts && wishlistedProducts.length > 0 ? (
                        wishlistedProducts.map((product) => (
                            <div
                                key={product.products.id}
                                className="flex items-center mb-4 justify-between space-x-4"
                            >
                                <div className="rounded-lg p-2 w-full flex items-center space-x-2">
                                    <div className="w-20 h-20">
                                        {product.products?.avatar_url ? (
                                            <div className="aspect-square rounded-lg">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    className="aspect-square rounded-lg mb-2"
                                                    src={
                                                        product.products
                                                            .avatar_url
                                                    }
                                                    alt={product.products.name}
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
                                            {product.products.name}
                                        </span>
                                        <span className="text-sm font-semibold">
                                            {formatCurrency(
                                                product.products.price
                                            )}
                                        </span>

                                        <div className="flex flex-col md:flex-row gap-2">
                                            <BetterLink
                                                href={`/outlets/${product.products.outlet_id}/products/${product.products.id}`}
                                                className="mt-4 flex items-center font-semibold space-x-2 p-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                            >
                                                View product
                                            </BetterLink>

                                            <button
                                                className="mt-4 flex items-center font-semibold space-x-2 p-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        product.products.id
                                                    )
                                                }
                                            >
                                                Remove from wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
