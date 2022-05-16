import Title from '../../components/common/Title.js';
import OutletsTable from '../../components/dashboard/OutletsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { supabase } from '../../utils/supabase-client.js';
import EditOutletForm from '../../components/forms/EditOutletForm.js';
import { useModals } from '@mantine/modals';

OutletsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function OutletsDashboardPage() {
    RequireAuth();

    const router = useRouter();
    const modals = useModals();

    const closeModal = () => modals.closeModal();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('outlets')
                    .select('*, users!outlets_owner_id_fkey (name, email)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOutlets(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOutlets();
    }, []);

    const addOutlet = async (outlet) => {
        try {
            if (!outlet) throw new Error("Outlet doesn't exist");

            // get non-null values
            const newOutlet = {
                ...Object.fromEntries(
                    Object.entries(outlet).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            delete newOutlet.id;

            const { data, error } = await supabase
                .from('outlets')
                .insert(newOutlet)
                .single();

            if (error) throw error;

            setOutlets((outlets) => [...outlets, data]);
            toast.success('Outlet added successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showCreateOutletModal = (outlet) =>
        modals.openModal({
            title: <div className="font-bold">Create new outlet</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditOutletForm
                        outlet={outlet}
                        closeModal={closeModal}
                        onCreate={(outlet) => addOutlet(outlet)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="flex mb-4">
                <Title label="Outlets" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={showCreateOutletModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <OutletsTable
                outlets={outlets}
                loading={loading}
                setter={setOutlets}
            />
        </div>
    ) : (
        <div></div>
    );
}
