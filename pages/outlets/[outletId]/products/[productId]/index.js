import { HeartIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Divider from '../../../../../components/common/Divider';
import Title from '../../../../../components/common/Title';
import { StoreLayout } from '../../../../../components/layout/layout';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../../utils/supabase-client';
import { formatCurrency } from '../../../../../utils/currency-format';
import AddToCartButton from '../../../../../components/buttons/AddToCartButton';
import AmountAdjuster from '../../../../../components/buttons/AmountAdjuster';
import { useCart } from '../../../../../hooks/useCart';
import BetterLink from '../../../../../components/link/BetterLink';
import ImageCard from '../../../../../components/cards/ImageCard';

DetailedProductPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedProductPage() {
    const router = useRouter();
    const { outletId, productId } = router.query;

    const { items: products, addItem, removeItem } = useCart();

    const [loadingOutlet, setLoadingOutlet] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const [outlet, setOutlet] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchOutlet = async () => {
            if (!outletId) return;

            try {
                const { data, error } = await supabase
                    .from('outlets')
                    .select('*')
                    .eq('id', outletId)
                    .single();

                if (error) throw error;
                setOutlet(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingOutlet(false);
            }
        };

        const fetchProduct = async () => {
            if (!productId) return;

            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .eq('outlet_id', outletId)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingProduct(false);
            }
        };

        const fetchAll = async () => {
            await Promise.all([fetchOutlet(), fetchProduct()]);
        };

        fetchAll();
    }, [outletId, productId]);

    const buyNow = () => {
        const productQuantity =
            products.find((i) => i.id === product.id)?.quantity || 0;

        if (productQuantity === 0) addItem(product);

        router.push(`/checkout`);
    };

    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg">
                    <div className="p-8 pb-0">
                        <Title label="Product details" />
                        <Divider />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 p-8 pt-0">
                        <div className="md:mr-8 aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="rounded-lg"
                                src={product?.avatar_url}
                                alt={product?.name}
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col justify-between w-full">
                            <div>
                                <Title className="max-w-full line-clamp-1">
                                    {product?.name}
                                </Title>

                                <div className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
                                    {formatCurrency(product?.price)}
                                </div>
                            </div>

                            <div className="mt-8 flex">
                                <HeartIcon className="w-8 hover:cursor-pointer" />

                                <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[8rem] lg:min-w-[16rem]">
                                    <button
                                        className="rounded-full border-2 border-zinc-500/70 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-white/10 text-zinc-700/70 dark:text-zinc-300 dark:hover:text-white hover:text-white font-semibold px-4 py-1 transition duration-300"
                                        onClick={buyNow}
                                    >
                                        Buy & Checkout
                                    </button>

                                    {products.findIndex(
                                        (i) => i.id === product?.id
                                    ) === -1 ? (
                                        <AddToCartButton
                                            onClick={() => addItem(product)}
                                        />
                                    ) : (
                                        <AmountAdjuster
                                            amount={
                                                products.find(
                                                    (i) => i.id === product?.id
                                                )?.quantity
                                            }
                                            onDecrement={() =>
                                                removeItem(product?.id)
                                            }
                                            onIncrement={() => addItem(product)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <Title label="Description" />
                    <Divider />
                    <div>{product?.description}</div>
                </div>

                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <Title label="Provider" />
                    <Divider />

                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div className="flex flex-col md:flex-row items-start md:items-end">
                            <ImageCard
                                sizing="h-32"
                                imageUrl={outlet?.avatar_url}
                                hideContent={true}
                            />

                            <div className="my-5 md:ml-5 space-y-2">
                                <div className="text-4xl font-semibold">
                                    {outlet?.name}
                                </div>

                                <div className="text-sm">{outlet?.address}</div>
                            </div>
                        </div>

                        <BetterLink
                            href={`/outlets/${outlet?.id}`}
                            className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        >
                            View outlet
                        </BetterLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
