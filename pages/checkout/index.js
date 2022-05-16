import { CreditCardIcon, LocationMarkerIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import { useCart } from '../../hooks/useCart';
import { useUser } from '../../hooks/useUser';
import { formatCurrency } from '../../utils/currency-format';
import { supabase } from '../../utils/supabase-client';
import FormSelect from '../../components/form/FormSelect';
import { BankLogo } from '../../components/common/Logo';
import OutletProductsCard from '../../components/cards/OutletProductsCard';
import FormInput from '../../components/form/FormInput';
import BetterLink from '../../components/link/BetterLink';
import { getRelativeTime } from '../../utils/date-format';

CheckoutPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useUser();

    const {
        setDiscount,
        checkingOut,
        checkoutSelected,
        products,
        selectedProducts,
        getSubtotal,
        getTotalForSelectedProducts,
    } = useCart();

    const [wishlistedProducts, setWishlistedProducts] = useState([]);
    const [loadingWishlistedProducts, setLoadingWishlistedProducts] =
        useState(true);

    const [productsByOutlet, setProductsByOutlet] = useState([]);

    useEffect(() => {
        const productsByOutlet = products.reduce((acc, product) => {
            const outletId = product.outlet_id;

            const outletProducts = acc[outletId]?.products || [];
            outletProducts.push(product);

            const data = {
                ...acc,
                [outletId]: {
                    ...acc[outletId],
                    id: outletId,
                    products: outletProducts,
                },
            };

            return data;
        }, {});

        // Map the products by outlet to an array
        const outletProducts = Object.values(productsByOutlet).map(
            (outlet) => ({ id: outlet.id, products: outlet.products })
        );

        setProductsByOutlet(outletProducts);
    }, [products]);

    const [cards, setCards] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [coupon, setCoupon] = useState('');

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;

            try {
                const { data } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user?.id);

                const addresses = data?.map((address) => {
                    return {
                        id: address.id,
                        name: address.name,
                        country: address.country,
                        province: address.province,
                        city: address.city,
                        streetInfo: address.street_info,
                    };
                });

                setAddresses(addresses ?? []);
                setSelectedAddress(addresses?.[0] ?? null);
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchCards = async () => {
            if (!user) return;

            try {
                const { data } = await supabase
                    .from('user_cards')
                    .select('*')
                    .eq('user_id', user?.id);

                setCards(data ?? []);
                setSelectedCard(data?.[0] ?? null);
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchWishlistedProducts = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('wishlisted_products')
                    .select('created_at, products (*)')
                    .eq('user_id', user?.id)
                    .order('created_at', {
                        ascending: false,
                    });

                if (error) throw error;
                setWishlistedProducts(data);
            } catch (error) {
                toast.error(error.message);
            }
            setLoadingWishlistedProducts(false);
        };

        const fetchAll = async () => {
            await Promise.all([
                fetchAddresses(),
                fetchCards(),
                fetchWishlistedProducts(),
            ]);
        };

        fetchAll();
    }, [user]);

    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const checkout = async () => {
        if (!user) return;

        try {
            if (!selectedAddress) {
                if (addresses && addresses.length > 0)
                    throw new Error('Please select a valid address.');
                else
                    throw new Error(
                        'Please create an address in the settings page before checking out.'
                    );
            }

            if (!selectedCard) {
                if (cards && cards.length > 0)
                    throw new Error('Please select a valid card.');
                else
                    throw new Error(
                        'Please create a card in the settings page before checking out.'
                    );
            }

            checkoutSelected(selectedCard, selectedAddress, selectedCoupon);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const applyCoupon = async () => {
        try {
            if (!coupon) throw new Error('Please enter a valid coupon.');

            const { data } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', coupon)
                .maybeSingle();

            if (!data) throw new Error('Coupon does not exist.');
            setSelectedCoupon(data);
            setDiscount({
                value: data?.value || 0,
                type: data?.use_ratio ? 'percentage' : 'value',
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

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
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 p-4 md:p-8 lg:p-16 gap-8">
            <div
                className={`${
                    !products || products.length == 0
                        ? 'col-span-full'
                        : 'md:col-span-3 lg:col-span-3'
                } grid gap-8`}
            >
                {productsByOutlet && productsByOutlet.length > 0 ? (
                    productsByOutlet.map((outlet) => (
                        <OutletProductsCard
                            key={outlet.id}
                            outletId={outlet.id}
                            products={outlet.products}
                        />
                    ))
                ) : (
                    <div className="text-xl font-semibold flex items-center justify-center bg-white text-zinc-500 dark:text-zinc-400 dark:bg-zinc-800/50 p-8 rounded-lg">
                        There are no products in your cart.
                    </div>
                )}
            </div>

            {products && products.length > 0 && (
                <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    {selectedProducts && selectedProducts.length > 0 ? (
                        <>
                            <Title label="Order summary" />
                            <Divider />

                            <div>
                                <div className="flex flex-row justify-between items-center">
                                    <span className="text-sm font-semibold">
                                        Subtotal ({selectedProducts?.length}{' '}
                                        items)
                                    </span>
                                    <span className="text-sm font-bold">
                                        {getSubtotal() == 0
                                            ? 'Free'
                                            : formatCurrency(getSubtotal(true))}
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between items-center">
                                    <span className="text-sm font-semibold">
                                        Shipping fees
                                    </span>
                                    <span className="text-sm font-bold">
                                        Free
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between items-center">
                                    <span className="text-sm font-semibold">
                                        Estimated Sale Tax
                                    </span>
                                    <span className="text-sm font-bold">
                                        Free
                                    </span>
                                </div>

                                {selectedCoupon && (
                                    <div className="text-blue-500 dark:text-blue-300 flex flex-row justify-between items-center">
                                        <span className="text-sm font-semibold">
                                            Coupon ({selectedCoupon?.code})
                                        </span>

                                        <span className="text-sm font-bold">
                                            {formatCurrency(
                                                -(selectedCoupon?.use_ratio
                                                    ? (getSubtotal() *
                                                          selectedCoupon?.value) /
                                                      100
                                                    : selectedCoupon?.value >
                                                      getSubtotal()
                                                    ? getSubtotal()
                                                    : selectedCoupon?.value)
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Divider />

                            <div className="flex flex-row justify-between items-center">
                                <Title className="text-sm font-semibold">
                                    Total
                                </Title>
                                <Title className="text-sm font-bold">
                                    {formatCurrency(
                                        getTotalForSelectedProducts()
                                    )}
                                </Title>
                            </div>
                            <Divider />

                            <div className="mb-8">
                                <FormSelect
                                    label="Payment method"
                                    value="pleasebank"
                                    options={[
                                        {
                                            label: 'Please Bank',
                                            value: 'pleasebank',
                                        },
                                    ]}
                                >
                                    <BankLogo width={50} height={30} />
                                </FormSelect>

                                <FormSelect
                                    label="Card"
                                    options={
                                        cards?.length > 0
                                            ? cards?.map((card) => ({
                                                  label: `${card?.card_number
                                                      ?.replace(
                                                          /(\d{4})/g,
                                                          '$1 '
                                                      )
                                                      ?.trim()} (${
                                                      card.bank_code
                                                  })`,
                                                  value: card.id,
                                              }))
                                            : [
                                                  {
                                                      label: 'No cards',
                                                      value: null,
                                                  },
                                              ]
                                    }
                                    value={selectedCard?.id}
                                    customSetter={(e) => {
                                        const card = cards?.find(
                                            (card) => card.id === e.target.value
                                        );
                                        setSelectedCard(card);
                                    }}
                                >
                                    <CreditCardIcon className="w-4 h-4" />
                                </FormSelect>

                                <FormSelect
                                    label="Shipping address"
                                    options={
                                        addresses?.length > 0
                                            ? addresses?.map((address) => ({
                                                  label: `${address.name} - ${address.streetInfo} - ${address.city} - ${address.country}`,
                                                  value: address.id,
                                              }))
                                            : [
                                                  {
                                                      label: 'No addresses',
                                                      value: null,
                                                  },
                                              ]
                                    }
                                    value={selectedAddress?.id}
                                    customSetter={(e) => {
                                        const address = addresses?.find(
                                            (address) =>
                                                address.id === e.target.value
                                        );
                                        setSelectedAddress(address);
                                    }}
                                >
                                    <LocationMarkerIcon className="w-4 h-4" />
                                </FormSelect>

                                <FormInput
                                    label="Coupon code"
                                    placeholder="Enter your coupon code"
                                    value={coupon}
                                    disabled={!!selectedCoupon}
                                    setter={(e) => setCoupon(e.toUpperCase())}
                                />

                                <div>
                                    {selectedCoupon && (
                                        <div className="flex flex-col mt-2 mb-4 items-start">
                                            <span className="text-sm font-semibold">
                                                {selectedCoupon.name}
                                            </span>

                                            <span className="text-blue-500 dark:text-blue-300 text-sm font-bold">
                                                {'(' +
                                                    (selectedCoupon?.use_ratio
                                                        ? `${selectedCoupon?.value}%`
                                                        : formatCurrency(
                                                              selectedCoupon?.value
                                                          )) +
                                                    ' discount)'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="w-full flex items-center justify-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                    onClick={
                                        !!selectedCoupon
                                            ? () => {
                                                  setSelectedCoupon(null);
                                                  setCoupon('');
                                                  setDiscount({
                                                      value: 0,
                                                      use_ratio: false,
                                                  });
                                              }
                                            : applyCoupon
                                    }
                                >
                                    {!!selectedCoupon
                                        ? 'Remove coupon'
                                        : 'Apply coupon'}
                                </button>
                            </div>
                            <Divider />

                            <div className="mt-4 space-y-2">
                                <button
                                    className="w-full rounded-lg bg-yellow-300/20 dark:bg-yellow-300/20 dark:hover:bg-yellow-400/40 hover:bg-yellow-300/30 text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-200 px-4 py-2 font-semibold transition duration-300"
                                    onClick={checkout}
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
                        </>
                    ) : (
                        <div className="text-center font-semibold text-lg text-zinc-500 dark:text-zinc-400">
                            Please select a product to checkout
                        </div>
                    )}
                </div>
            )}

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
                                        <span className="text-sm font-semibold">
                                            {getRelativeTime(
                                                product.created_at
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
