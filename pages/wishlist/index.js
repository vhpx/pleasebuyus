import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import { useUser } from '../../hooks/useUser';
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
