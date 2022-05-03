import { CollectionIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import Divider from '../components/common/Divider';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';
import { RequireAuth } from '../hooks/useUser';

PurchaseHistoryPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

const purchases = [];

export default function PurchaseHistoryPage() {
    RequireAuth();

    const router = useRouter();

    const navigateToBrowseItems = () => {
        router.push('/');
    };

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Purchase History" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {purchases && purchases.length > 0 ? (
                        purchases.map((purchase) => <div key={purchase.id} />)
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any purchases yet.
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={navigateToBrowseItems}
                            >
                                <CollectionIcon className="w-4 h-4" />
                                <div>Browse items</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
