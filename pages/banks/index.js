import { PlusIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { BankLayout } from '../../components/layout/layout';
import Title from '../../components/typography/Title';
import { RequireAuth } from '../../hooks/useUser';

BanksPage.getLayout = (page) => {
    return <BankLayout>{page}</BankLayout>;
};

export default function BanksPage() {
    RequireAuth();

    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCards([]);
            setBanks([]);

            setLoadingCards(false);
            setLoadingBanks(false);
        }, 1000);

        timeout;
    }, []);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Your cards"></Title>
                    <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingCards ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : cards && cards.length > 0 ? (
                        cards.map((card) => <div key={card.id}></div>)
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any cards yet.
                            </p>

                            <button className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300">
                                <PlusIcon className="w-4 h-4" />
                                <div>Add a card</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Banks" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingBanks ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : banks && banks.length > 0 ? (
                        banks.map((bank) => <div key={bank.id}></div>)
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                There are no banks yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
