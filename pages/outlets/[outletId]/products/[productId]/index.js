import { HeartIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import OutlinedButton from '../../../../../components/buttons/OutlinedButton';
import Divider from '../../../../../components/common/Divider';
import Title from '../../../../../components/common/Title';
import { StoreLayout } from '../../../../../components/layout/layout';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../../utils/supabase-client';
import { formatCurrency } from '../../../../../utils/currency-format';

DetailedProductPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedProductPage() {
    const router = useRouter();
    const { outletId, productId } = router.query;

    const [loadingOutlet, setLoadingOutlet] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const [outlet, setOutlet] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchOutlet = async () => {
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

    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <div className="flex p-8">
                        <div className="w-1/3 mr-8 aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="rounded-lg"
                                src={product?.avatar_url}
                                alt={product?.name}
                            />
                        </div>
                        <div className="w-2/3 ">
                            <div className="text-4xl font-semibold">
                                {product?.name}
                            </div>
                            <Divider />

                            <div className="text-2xl font-semibold">
                                {formatCurrency(product?.price)}
                            </div>

                            <div className="mt-9 flex 0">
                                <HeartIcon className="w-9 mr-12 hover:cursor-pointer" />
                                <div className="grid grid-cols-2 gap-x-12">
                                    <OutlinedButton label="Add to cart" />
                                    <OutlinedButton label="Buy now" />
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
            </div>
        </div>
    );
}
