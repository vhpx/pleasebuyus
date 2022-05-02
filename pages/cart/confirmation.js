import { StoreLayout } from '../../components/layout/layout';
import Link from 'next/link';
import Title from '../../components/common/Title';

ConfirmationPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function ConfirmationPage() {
    return (
        <div className="flex justify-center items-center">
            
            <div className="col-span-1 flex flex-col mb-4 item-center justify-center m-2 w-auto max-w-md bg-white dark:bg-zinc-800 rounded shadow-lg px-8 pt-6 pb-8">
                <div className="flex item-center justify-center mb-1 pt-1 pb-1">
                    <Title label="Order Comfirmation" />
                </div>

                <div>
                    <div className="mt-2 mb-1 h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="text text-left text-l text-gray-600 mb-1 pt-1 pb-1">
                        {' '}
                        Item(s) Total{' '}
                    </div>
                    <div className="text text-left text-l text-gray-600 mb-1 pt-1 pb-1">
                        {' '}
                        Shipping Fees{' '}
                    </div>
                    <a
                        className="text text-left text-l text-gray-600 hover:text-indigo-600 duration-300 mb-1 pt-1 pb-1"
                        href="https://en.wikipedia.org/wiki/Sales_tax"
                    >
                        Estimated Sale Tax
                    </a>
                    <div className="mt-2 mb-1 h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
                </div>

                <div className="text text-left font-bold text-xl text-black mb-1 pt-1 pb-1">
                    {' '}
                    Total{' '}
                </div>

                <button className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded mt-2 mb-2 duration-300">
                    Checkout
                </button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white hover:text-gray-200 font-bold py-2 px-4 rounded mt-2 mb-2 duration-300">
                    Continue Shopping
                </button>

                <Link href="/login" passHref>
                    <a className="text text-left text-l text-blue-700 hover:text-indigo-600 duration-300 mb-1 pt-1 pb-1">
                        {' '}
                        Sign in or Create an account now to learn more about
                        PleaseBuy Points™
                    </a>
                </Link>
                <div className="mt-2 mb-1 h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />

                <div className="text text-left font-bold text-xl text-black mb-1 pt-4 pb-1">
                    {' '}
                    Apply today, Shop Now.{' '}
                </div>

                <div className="text text-left text-l text-gray-600 mb-1 pt-1 pb-1">
                    {' '}
                    10% back in rewards on first day of purchases for new
                    PleaseBuy® Members or accumilate point(s) to exchange for
                    discount!{' '}
                </div>
            </div>
        </div>
    );
}