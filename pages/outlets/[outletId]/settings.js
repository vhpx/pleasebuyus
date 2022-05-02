import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import ImageCard from '../../../components/cards/ImageCard';
import ItemCard from '../../../components/cards/ItemCard';
import Card from '../../../components/common/Card';
import { toast } from 'react-toastify';
import Divider from '../../../components/common/Divider';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import Title from '../../../components/common/Title';
import FormInput from '../../../components/form/FormInput';
import { StoreLayout } from '../../../components/layout/layout';
import BetterLink from '../../../components/link/BetterLink';
import { supabase } from '../../../utils/supabase-client';

OutletSettingsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletSettingsPage() {
    const router = useRouter();
    const { outletId } = router.query;

    const [loadingOutlet, setLoadingOutlet] = useState(true);
    const [savingOutlet, setSavingOutlet] = useState(false);
    const [outlet, setOutlet] = useState(null);

    const [loadingItems, setLoadingItems] = useState(true);
    const [items, setItems] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setItems([]);
            setCategories([]);

            setLoadingItems(false);
            setLoadingCategories(false);
        }, 1000);

        const fetchOutlet = async () => {
            try {
                if (!outletId) return;

                const { data: outletData, error } = await supabase
                    .from('outlets')
                    .select('*')
                    .eq('id', outletId)
                    .maybeSingle();

                if (error) throw error;

                setOutlet(outletData);
                setLoadingOutlet(false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchOutlet();
        timeout;
    }, [outletId]);

    const handleSaveOutlet = async () => {
        setSavingOutlet(true);

        try {
            const { data: outletData, error } = await supabase
                .from('outlets')
                .update(outlet)
                .eq('id', outletId)
                .single();

            if (error) throw error;

            setOutlet(outletData);
            setSavingOutlet(false);

            toast.success('Outlet saved');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingOutlet(false);
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Outlet Information"></Title>
                <Divider />

                {loadingItems ? (
                    <div className="col-span-full text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="lg:w-2/3 mb-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                            <FormInput
                                label="Name"
                                value={outlet?.name}
                                setter={(value) => {
                                    setOutlet({
                                        ...outlet,
                                        name: value,
                                    });
                                }}
                            />
                            <FormInput
                                label="Address"
                                value={outlet?.address}
                                setter={(value) => {
                                    setOutlet({
                                        ...outlet,
                                        address: value,
                                    });
                                }}
                            />

                            <div className="h-4 col-span-full" />

                            <OutlinedButton
                                loading={savingOutlet}
                                label="Save Outlet"
                                loadingLabel="Saving"
                                className="max-w-sm"
                                onClick={handleSaveOutlet}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Items"></Title>
                    <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingItems ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : items && items.length > 0 ? (
                        items.map((outlet) => (
                            <BetterLink
                                key={outlet.id}
                                href={`/outlets/${outlet.id}`}
                                className="relative"
                            >
                                <ImageCard
                                    name={outlet.name || 'Unnamed outlet'}
                                    desc={outlet.address || 'Unknown address'}
                                    imageUrl={outlet.imageUrl}
                                />

                                <BetterLink
                                    href={`/outlets/${outlet.id}/settings`}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </BetterLink>
                            </BetterLink>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No items added yet
                            </p>

                            <button className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300">
                                <PlusIcon className="w-4 h-4" />
                                <div>Add item</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex">
                    <Title label="Categories"></Title>
                    <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingCategories ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((outlet) => (
                            <BetterLink
                                key={outlet.id}
                                href={`/outlets/${outlet.id}`}
                                className="relative"
                            >
                                <ImageCard
                                    name={outlet.name || 'Unnamed outlet'}
                                    desc={outlet.address || 'Unknown address'}
                                    imageUrl={outlet.imageUrl}
                                />

                                <BetterLink
                                    href={`/outlets/${outlet.id}/settings`}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition duration-300"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </BetterLink>
                            </BetterLink>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                No categories added yet
                            </p>

                            <button className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300">
                                <PlusIcon className="w-4 h-4" />
                                <div>Add category</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
