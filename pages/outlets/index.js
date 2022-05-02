import { PlusIcon } from '@heroicons/react/outline';
import ImageCard from '../../components/cards/ImageCard';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

import { useModals } from '@mantine/modals';
import CreateOutletForm from '../../components/forms/CreateOutletForm';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase-client';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';

OutletsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletsPage() {
    const { user } = useUser();

    const modals = useModals();
    const closeModal = () => modals.closeModal();

    const openOutletCreationModal = () =>
        modals.openModal({
            title: <div className="font-bold">Create Outlet</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <CreateOutletForm
                        closeModal={closeModal}
                        onCreate={(name, address) =>
                            openOutletConfirmationModal(name, address)
                        }
                    />
                </div>
            ),
            onClose: () => {},
        });

    const openOutletConfirmationModal = (name, address) =>
        modals.openModal({
            title: <div className="font-bold">Confirm Outlet Information</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <div className="flex flex-col space-y-1">
                        <div className="mb-4">
                            You are about to create an outlet with the following
                            information:
                        </div>

                        <div className="p-4 flex flex-col rounded-lg dark:bg-zinc-800 items-start">
                            <div className="font-bold">
                                {name || 'Unnamed outlet'}
                            </div>
                            <div className="text-sm">
                                {address || 'Unknown address'}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-8">
                        <button
                            className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                            onClick={() => createOutlet(name, address)}
                        >
                            Create Outlet
                        </button>
                    </div>
                </div>
            ),
        });

    const [loadingMyOutlets, setLoadingMyOutlets] = useState(true);
    const [loadingOtherOutlets, setLoadingOtherOutlets] = useState(true);

    const [myOutlets, setMyOutlets] = useState([]);
    const [otherOutlets, setOtherOutlets] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchMyOutlets = async () => {
            try {
                const { data: myOutlets, error: myOutletsError } =
                    await supabase
                        .from('outlets')
                        .select('*')
                        .eq('owner_id', user.id);

                if (myOutletsError) throw myOutletsError;

                setMyOutlets(myOutlets);
                setLoadingMyOutlets(false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchOtherOutlets = async () => {
            try {
                const { data: otherOutlets, error: otherOutletsError } =
                    await supabase
                        .from('outlets')
                        .select('*')
                        .neq('owner_id', user.id);

                if (otherOutletsError) throw otherOutletsError;

                setOtherOutlets(otherOutlets);
                setLoadingOtherOutlets(false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        Promise.all([fetchMyOutlets(), fetchOtherOutlets()]);
    }, [user]);

    const createOutlet = async (name, address) => {
        try {
            if (!user) throw new Error('User not found');

            const { data, error } = await supabase
                .from('outlets')
                .insert({
                    owner_id: user.id,
                    name,
                    address,
                })
                .maybeSingle();

            if (error || !data) throw new Error('Error creating outlet');
            toast.success('Outlet created successfully');
            closeModal();

            setMyOutlets((myOutlets) => [...myOutlets, data]);
        } catch (error) {
            toast.error(error.message || 'Error creating outlet');
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <div className="flex">
                    <Title label="Your outlets" />
                    <button
                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                        onClick={openOutletCreationModal}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingMyOutlets ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : myOutlets && myOutlets.length > 0 ? (
                        myOutlets.map((outlet) => (
                            <ImageCard
                                key={outlet.id}
                                name={outlet.name || 'Unnamed outlet'}
                                desc={outlet.address || 'Unknown address'}
                                imageUrl={outlet.imageUrl}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any outlets yet.
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={openOutletCreationModal}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <div>Create your first outlet</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Discover" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {loadingOtherOutlets ? (
                        <div className="col-span-full text-center">
                            <LoadingIndicator svgClassName="w-8 h-8" />
                        </div>
                    ) : otherOutlets && otherOutlets.length > 0 ? (
                        otherOutlets.map((outlet) => (
                            <ImageCard
                                key={outlet.name}
                                name={outlet.name}
                                desc={outlet.address}
                                imageUrl={outlet.imageUrl}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-4 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                There are no other outlets yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
