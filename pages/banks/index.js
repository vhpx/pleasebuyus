import { PlusIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { BankLayout } from '../../components/layout/layout';
import Title from '../../components/typography/Title';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase-client';

BanksPage.getLayout = (page) => {
    return <BankLayout>{page}</BankLayout>;
};

export default function BanksPage() {
    const { userData } = useUser();

    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCards([]);

            setLoadingCards(false);
        }, 1000);

        const fetchBanks = async () => {
            try {
                const { data, error } = await supabase
                    .from('banks')
                    .select('*');

                if (error) throw error;

                setBanks(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingBanks(false);
            }
        };

        timeout;
        fetchBanks();
    }, []);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            {userData && (
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
            )}

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Supported Banks" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loadingBanks ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : banks && banks.length > 0 ? (
                        banks.map((bank) => (
                            <Card
                                key={bank.id}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex space-x-2 items-center">
                                    <div className="font-bold px-4 py-1 rounded-lg bg-blue-500 dark:bg-blue-500/20 text-white dark:text-blue-200">
                                        {bank.code}
                                    </div>
                                    <div className="font-semibold text-lg">
                                        {bank.short_name}
                                    </div>
                                </div>
                                <div>{bank.name}</div>
                            </Card>
                        ))
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
