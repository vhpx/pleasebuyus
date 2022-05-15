import { BadgeCheckIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import { StoreLayout } from '../../components/layout/layout';
import { RequireAuth } from '../../hooks/useUser';

CheckoutCompletedPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function CheckoutCompletedPage() {
    RequireAuth();

    const router = useRouter();
    const [billIds, setBillIds] = useState([]);

    useEffect(() => {
        const billIds = router?.query?.bills?.split(',');
        setBillIds(billIds);
    }, [router?.query]);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            {billIds && billIds.length > 0 ? (
                billIds.map((billId) => (
                    <div
                        key={billId}
                        className="w-2/3 m-auto text-center bg-white dark:bg-zinc-800/50 p-8 rounded-lg"
                    >
                        <div className="mb-12">
                            <BadgeCheckIcon className="pt-3 m-auto w-[8rem] font-thin" />
                            <div className="my-3 text-4xl font-semibold">
                                Order Successful
                            </div>
                            <div className="text-lg">
                                Your order ID is {billId}
                            </div>
                            <div className="text-lg">
                                Thank you for shopping with us!
                            </div>
                        </div>
                        <div className="m-auto w-3/4 grid grid-cols-2 gap-8">
                            <OutlinedButton
                                href="/"
                                label="Continue shopping"
                            />
                            <OutlinedButton
                                href={`/bills/${billId}`}
                                label="View invoice"
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="w-2/3 m-auto text-center bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <div className="mb-4">Sorry, something went wrong.</div>
                    <OutlinedButton
                        href="/"
                        label="Continue shopping"
                        widthConstraint="md:w-1/2"
                    />
                </div>
            )}
        </div>
    );
}
