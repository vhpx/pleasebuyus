import { Popover } from '@headlessui/react';
import { MinusIcon, PlusIcon, HeartIcon } from '@heroicons/react/outline';
import { useCart } from '../../hooks/useCart';
import { currencyFormatter } from '../../utils/currency-format';

export default function WishlistDropdown({ loggedIn, whiteText }) {
    const { items, addItem, removeItem, clearCart, getTotalItems, getTotal } =
        useCart();

    return (
        <Popover className="relative">
            <Popover.Button
                className={`flex items-center justify-center space-x-1 rounded-lg px-3 ${
                    loggedIn ? 'py-[0.725rem]' : 'py-2'
                } transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800`}
            >
                <HeartIcon className={`h-5 w-5 ${whiteText && 'text-white'}`} />
                <div className={`font-semibold ${whiteText && 'text-white'}`}>
                    Wishlist
                </div>
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[3.5rem] z-10">
                <div className="my-1 flex w-72 flex-col rounded-lg bg-white/50 p-4 shadow backdrop-blur dark:bg-zinc-700/50 md:w-[30rem]">
                    {items && items.length > 0 ? (
                        <>
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="mb-2 space-y-1 border-b pb-2 dark:border-zinc-500"
                                >
                                    <div className="space-y-1">
                                        <div className="flex w-full justify-between space-x-4">
                                            <div className="font-semibold line-clamp-1">
                                                {item.name}
                                            </div>
                                            <div className="flex-none font-semibold text-blue-600 dark:text-blue-300">
                                                {currencyFormatter().format(
                                                    item.price
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between space-x-4">
                                            <div className="text-sm text-zinc-600 line-clamp-2 dark:text-zinc-200">
                                                {item.description}
                                            </div>
                                            <div className="flex w-fit items-center rounded-lg border bg-white/50 dark:border-zinc-500 dark:bg-zinc-700/50">
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.id,
                                                            item.name
                                                        )
                                                    }
                                                    className="p-2"
                                                >
                                                    <MinusIcon className="h-4 w-4 font-semibold" />
                                                </button>
                                                <div className="px-2 font-semibold">
                                                    {
                                                        items.find(
                                                            (i) =>
                                                                i.id === item.id
                                                        ).quantity
                                                    }
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        addItem(item)
                                                    }
                                                    className="p-2"
                                                >
                                                    <PlusIcon className="h-4 w-4 font-semibold" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between font-semibold">
                                <div>
                                    {getTotalItems() > 1
                                        ? `${getTotalItems()} items`
                                        : '1 item'}
                                </div>
                                <div>
                                    {currencyFormatter().format(getTotal())}
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 justify-between space-x-2">
                                <button
                                    onClick={() => clearCart()}
                                    className="col-span-1 rounded-lg bg-red-500 px-2 py-1 text-white"
                                >
                                    Empty cart
                                </button>
                                <button className="col-span-2 rounded-lg bg-blue-500 px-2 py-1 text-white">
                                    Checkout
                                </button>
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
            </Popover.Panel>
        </Popover>
    );
}
