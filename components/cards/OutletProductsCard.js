import { CheckCircleIcon, PlusIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';
import AmountAdjuster from '../buttons/AmountAdjuster';
import Divider from '../common/Divider';
import LoadingIndicator from '../common/LoadingIndicator';
import BetterLink from '../link/BetterLink';

export default function OutletProductsCard({ outletId, products }) {
    const {
        products: cartProducts,
        addProduct,
        removeProduct,

        getSelectedProductsByOutletId,

        selectProductWithId,
        deselectProductWithId,

        isProductSelected,
    } = useCart();

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

    const handleSelectOutlet = () => {
        // For each product in products,
        // select it if it's not already selected
        products.forEach((product) => {
            if (!isProductSelected(product.id, outletId))
                selectProductWithId(product.id, outletId);
        });
    };

    const handleDeselectOutlet = () => {
        // For each product in products,
        // deselect it if it's selected
        products.forEach((product) => {
            if (isProductSelected(product.id, outletId))
                deselectProductWithId(product.id, outletId);
        });
    };

    const allProductsSelected = products.every((product) =>
        isProductSelected(product.id, outletId)
    );

    const selectedProductsCount =
        getSelectedProductsByOutletId(outletId).length;

    return (
        <div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
            {loadingOutlet ? (
                <div className="col-span-full text-center">
                    <LoadingIndicator svgClassName="w-8 h-8" />
                </div>
            ) : (
                <div>
                    <button
                        className="flex items-center hover:bg-blue-50 dark:hover:bg-zinc-800 group p-2 space-x-2 rounded-lg"
                        onClick={() =>
                            allProductsSelected
                                ? handleDeselectOutlet()
                                : handleSelectOutlet()
                        }
                    >
                        <CheckCircleIcon
                            className={`w-8 h-8 transition duration-150 ${
                                allProductsSelected ||
                                getSelectedProductsByOutletId(outletId)
                                    .length == products.length
                                    ? 'text-green-500'
                                    : 'text-zinc-500/50 dark:text-zinc-500'
                            }`}
                        />
                        <div className="font-bold text-lg md:text-xl lg:text-2xl">
                            {outlet.name}{' '}
                            <span className="text-zinc-500 dark:text-zinc-400">
                                (
                                {(allProductsSelected
                                    ? products?.length
                                    : selectedProductsCount) || '0'}
                                /{products.length})
                            </span>
                        </div>
                    </button>
                    <Divider />

                    {products && products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={product.id} className="flex flex-col">
                                <div className="flex flex-col md:flex-row items-center mb-4 justify-between gap-4">
                                    <button
                                        className="rounded-lg p-2 hover:bg-blue-50 dark:hover:bg-zinc-800 w-full flex items-center space-x-2 transition duration-300"
                                        onClick={() =>
                                            isProductSelected(
                                                product.id,
                                                outletId
                                            )
                                                ? deselectProductWithId(
                                                      product.id,
                                                      outletId
                                                  )
                                                : selectProductWithId(
                                                      product.id,
                                                      outletId
                                                  )
                                        }
                                    >
                                        <CheckCircleIcon
                                            className={`w-8 h-8 transition duration-150 ${
                                                allProductsSelected ||
                                                isProductSelected(
                                                    product.id,
                                                    outletId
                                                )
                                                    ? 'text-green-500'
                                                    : 'text-zinc-500/50 dark:text-zinc-500'
                                            }`}
                                        />

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
                                                className="hidden mt-4 md:flex items-center font-semibold space-x-2 p-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                            >
                                                View product
                                            </BetterLink>
                                        </div>
                                    </button>

                                    <div className="flex gap-4">
                                        <AmountAdjuster
                                            amount={
                                                cartProducts.find(
                                                    (i) => i.id === product.id
                                                )?.quantity
                                            }
                                            onDecrement={() =>
                                                removeProduct(product.id)
                                            }
                                            onIncrement={() =>
                                                addProduct(product)
                                            }
                                        />

                                        <div className="md:min-w-[4rem] hidden text-right md:flex flex-col justify-center space-y-2">
                                            <span className="text-sm font-bold">
                                                {formatCurrency(
                                                    product.quantity *
                                                        product.price
                                                )}
                                            </span>
                                        </div>
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
