import { HeartIcon, PencilIcon } from '@heroicons/react/outline';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/solid';
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
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';
import EditProductForm from '../../../../../components/forms/EditProductForm';
import { useModals } from '@mantine/modals';
import { useUser } from '../../../../../hooks/useUser';

DetailedProductPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedProductPage() {
    const router = useRouter();
    const modals = useModals();

    const { outletId, productId } = router.query;

    const { user } = useUser();
    const { addProduct } = useCart();

    const [loadingOutlet, setLoadingOutlet] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const [outlet, setOutlet] = useState(null);
    const [product, setProduct] = useState(null);
    const [wishlisted, setWishlisted] = useState(null);

    const [amount, setAmount] = useState(0);
    const closeModal = () => modals.closeModal();

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
                    .select('*, outlet_categories (name)')
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

        const fetchWishlist = async () => {
            if (!user?.id) return;
            if (!productId) return;

            try {
                const { data, error } = await supabase
                    .from('wishlisted_products')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('product_id', productId)
                    .maybeSingle();

                if (error) throw error;
                setWishlisted(data ? true : false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchAll = async () => {
            await Promise.all([fetchOutlet(), fetchProduct(), fetchWishlist()]);
        };

        fetchAll();
    }, [outletId, productId, user?.id]);

    const buyNow = () => {
        addProduct(product, amount || 1, true);
        setAmount(0);

        router.push(`/checkout`);
    };

    const openProductEditModal = (product) =>
        modals.openModal({
            title: (
                <div className="font-bold">
                    {product ? 'Edit product' : 'Add new product'}
                </div>
            ),
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditProductForm
                        user={user}
                        outletId={outletId}
                        categories={[
                            {
                                id: product?.category_id,
                                name: product?.outlet_categories?.name,
                            },
                        ]}
                        product={product}
                        closeModal={closeModal}
                        singleSetter={setProduct}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const wishlistProduct = async () => {
        if (!user?.id) return;

        try {
            if (wishlisted) {
                const { error } = await supabase
                    .from('wishlisted_products')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', productId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('wishlisted_products')
                    .insert({
                        user_id: user.id,
                        product_id: productId,
                    });

                if (error) throw error;
            }

            setWishlisted(!wishlisted);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg">
                    <div className="p-8 pb-0">
                        <div className="flex">
                            <Title label="Product details" />
                            {user?.id &&
                                outlet?.id &&
                                user.id === outlet?.owner_id && (
                                    <button
                                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                                        onClick={() =>
                                            openProductEditModal(product)
                                        }
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                )}
                        </div>
                        <Divider />
                    </div>

                    {loadingProduct ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 p-8 pt-0">
                            {product?.avatar_url && (
                                <div className="md:mr-8 aspect-video">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="rounded-lg"
                                        src={product?.avatar_url}
                                        alt={product?.name}
                                    />
                                </div>
                            )}

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
                                    {wishlisted != null && (
                                        <button onClick={wishlistProduct}>
                                            {wishlisted ? (
                                                <SolidHeartIcon className="w-8 hover:cursor-pointer text-red-500" />
                                            ) : (
                                                <HeartIcon className="w-8 hover:cursor-pointer" />
                                            )}
                                        </button>
                                    )}

                                    <div className="ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-[8rem] lg:min-w-[16rem]">
                                        <button
                                            className="rounded-full border-2 border-zinc-500/70 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-white/10 text-zinc-700/70 dark:text-zinc-300 dark:hover:text-white hover:text-white font-semibold px-4 py-1 transition duration-300"
                                            onClick={buyNow}
                                        >
                                            Buy & Checkout
                                        </button>

                                        <AmountAdjuster
                                            amount={amount}
                                            onDecrement={() =>
                                                setAmount(
                                                    Math.max(0, amount - 1)
                                                )
                                            }
                                            onIncrement={() =>
                                                setAmount(
                                                    Math.min(amount + 1, 10)
                                                )
                                            }
                                        />

                                        <AddToCartButton
                                            className="col-span-full lg:col-span-1"
                                            onClick={() => {
                                                addProduct(
                                                    product,
                                                    amount,
                                                    true
                                                );
                                                setAmount(0);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <Title label="Description" />
                    <Divider />
                    <div>
                        {product?.description || 'No description available'}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <Title label="Outlet details" />
                    <Divider />

                    {loadingOutlet ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : (
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

                                    <div className="text-sm">
                                        {outlet?.address}
                                    </div>
                                </div>
                            </div>

                            <BetterLink
                                href={`/outlets/${outlet?.id}`}
                                className="w-fit rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-2 py-1 font-semibold transition duration-300 text-center mb-2"
                            >
                                View outlet
                            </BetterLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
