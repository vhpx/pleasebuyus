import { PlusIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';
import Divider from '../common/Divider';
import LoadingIndicator from '../common/LoadingIndicator';
import Title from '../common/Title';
import BetterLink from '../link/BetterLink';

export default function OutletProductsCard({ outletId, products }) {
    const [outlet, setOutlet] = useState(null);
    const [loadingOutlet, setLoadingOutlet] = useState(true);

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

        fetchOutlet();
    }, [outletId]);

    return (
        <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
            {loadingOutlet ? (
                <div className="col-span-full text-center">
                    <LoadingIndicator svgClassName="w-8 h-8" />
                </div>
            ) : (
                <div>
                    <Title
                        label={`${outlet.name} (${products?.length || 0})`}
                    />
                    <Divider />

                    {products && products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={product.id} className="flex flex-col">
                                <div className="flex flex-row mb-4 justify-between">
                                    <BetterLink
                                        href={`/outlets/${product.outlet_id}/products/${product.id}`}
                                        className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-zinc-800 mr-4 w-full flex items-center space-x-2 transition duration-300"
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
                                                {product.name} (x
                                                {product.quantity})
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
            )}
        </div>
    );
}
