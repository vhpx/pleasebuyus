import Title from '../../components/common/Title.js';
import BanksTable from '../../components/dashboard/BanksTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client.js';
import EditBankForm from '../../components/forms/EditBankForm.js';

BanksDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BanksDashboardPage() {
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

    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('banks')
                    .select('*')
                    .order('name');

                if (error) throw error;
                setBanks(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBanks();
    }, []);

    const addBank = async (bank) => {
        try {
            if (!bank) throw new Error("Bank doesn't exist");

            // get non-null values
            const newBank = {
                ...Object.fromEntries(
                    Object.entries(bank).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            delete newBank.id;

            const { data, error } = await supabase
                .from('banks')
                .insert(newBank)
                .single();

            if (error) throw error;

            setBanks((banks) => [...banks, data]);
            toast.success('Bank added successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showCreateBankModal = (bank) =>
        modals.openModal({
            title: <div className="font-bold">Create new bank</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditBankForm
                        bank={bank}
                        closeModal={closeModal}
                        onCreate={(coupon) => addBank(coupon)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="flex mb-4">
                <Title label="Banks" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={showCreateBankModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <BanksTable banks={banks} loading={loading} setter={setBanks} />
        </div>
    ) : (
        <div></div>
    );
}
