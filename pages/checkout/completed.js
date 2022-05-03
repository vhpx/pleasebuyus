import { BadgeCheckIcon } from '@heroicons/react/outline';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import { StoreLayout } from '../../components/layout/layout';

CheckoutCompletedPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function CheckoutCompletedPage() {
    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="w-2/3 m-auto text-center bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <div className="">
                        <div className="mb-12">
                            <BadgeCheckIcon className="pt-3 m-auto w-[8rem] font-thin" />
                            <div className="my-3 text-4xl font-semibold">
                                Order Successful
                            </div>
                            <div className="text-lg">
                                Your order ID is: 999999
                            </div>
                            <div className="text-lg">
                                Thank you so much for your order.
                            </div>
                        </div>
                        <div className="m-auto w-3/4 grid grid-cols-2 gap-8">
                            <OutlinedButton label="Continue shopping" />
                            <OutlinedButton label="Check status" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
