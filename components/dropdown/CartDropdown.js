import { Popover } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useCart } from '../../hooks/useCart';
import { currencyFormatter } from '../../utils/currency-format';
import AmountAdjuster from '../buttons/AmountAdjuster';

export default function CartDropdown({ loggedIn, whiteText }) {
    const {
        products,
        addProduct,
        removeProduct,
        clearCart,
        getTotalProducts,
        getTotal,
    } = useCart();

    const router = useRouter();

    const navigateToCheckout = () => {
        router.push('/checkout');
    };

    return (
        <Popover className="relative">
            <Popover.Button
                className={`flex items-center justify-center space-x-1 rounded-lg px-3 ${
                    loggedIn ? 'py-[0.725rem]' : 'py-2'
                } transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800`}
            >
                <ShoppingCartIcon
                    className={`h-5 w-5 ${whiteText && 'text-white'}`}
                />
                <div className={`font-semibold ${whiteText && 'text-white'}`}>
                    Cart ({getTotalProducts() > 10 ? '10+' : getTotalProducts()}
                    )
                </div>
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[3.5rem] z-10">
                {({ close }) => (
                    <div className="my-1 flex w-72 flex-col rounded-lg bg-white/80 p-4 shadow backdrop-blur-lg dark:bg-zinc-800/80 md:w-[30rem]">
                        {products && products.length > 0 ? (
                            <>
                                {products.slice(0, 3).map((product) => (
                                    <div
                                        key={product.id}
                                        className="mb-2 space-y-1 border-b pb-2 dark:border-zinc-500/50"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex w-full justify-between space-x-4">
                                                <div className="font-semibold line-clamp-1">
                                                    {product.name}
                                                </div>
                                                <div className="flex-none font-semibold text-blue-600 dark:text-blue-300">
                                                    {currencyFormatter().format(
                                                        product.price
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-fit">
                                                <AmountAdjuster
                                                    amount={
                                                        products.find(
                                                            (i) =>
                                                                i.id ===
                                                                product.id
                                                        )?.quantity
                                                    }
                                                    onDecrement={() =>
                                                        removeProduct(
                                                            product.id
                                                        )
                                                    }
                                                    onIncrement={() =>
                                                        addProduct(product)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {router.pathname === '/checkout' || (
                                    <button
                                        className="col-span-1 rounded-lg bg-purple-300/20 dark:bg-purple-300/20 dark:hover:bg-purple-400/40 hover:bg-purple-300/30 text-purple-600 dark:text-purple-300 dark:hover:text-purple-200 px-2 py-1 font-semibold transition duration-300 w-full text-center mb-2"
                                        onClick={() => {
                                            navigateToCheckout();
                                            close();
                                        }}
                                    >
                                        View{' '}
                                        {products.length > 1
                                            ? `all ${products.length} products`
                                            : '1 product'}{' '}
                                        in cart
                                    </button>
                                )}

                                <div className="flex justify-between font-semibold">
                                    <div>
                                        {getTotalProducts() > 1
                                            ? `${getTotalProducts()} items`
                                            : '1 item'}
                                    </div>
                                    <div>
                                        {currencyFormatter().format(getTotal())}
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 justify-between space-x-2">
                                    <button
                                        className={`${
                                            router.pathname === '/checkout'
                                                ? 'col-span-full'
                                                : 'col-span-1'
                                        } rounded-lg bg-red-300/20 dark:bg-red-300/20 dark:hover:bg-red-400/40 hover:bg-red-300/30 text-red-600 dark:text-red-300 dark:hover:text-red-200 px-2 py-1 font-semibold transition duration-300`}
                                        onClick={() => {
                                            clearCart();
                                            close();
                                        }}
                                    >
                                        Empty cart
                                    </button>
                                    {router.pathname === '/checkout' || (
                                        <button
                                            className="col-span-2 rounded-lg bg-blue-300/20 dark:bg-blue-300/20 dark:hover:bg-blue-400/40 hover:bg-blue-300/30 text-blue-600 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-1 font-semibold transition duration-300"
                                            onClick={() => {
                                                navigateToCheckout();
                                                close();
                                            }}
                                        >
                                            Checkout
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="py-32 text-center text-xl font-semibold text-zinc-600 dark:text-zinc-200">
                                    The cart is empty.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    );
}
