import Title from '../../components/common/Title.js';
import AdminsTable from '../../components/dashboard/AdminsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { useModals } from '@mantine/modals';
import { supabase } from '../../utils/supabase-client.js';
import CreateAdminForm from '../../components/forms/CreateAdminForm.js';

AdminsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function AdminsDashboardPage() {
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

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                if (!initialized) return;
                setLoading(true);

                const { data, error } = await supabase
                    .from('admins')
                    .select('users (*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAdmins(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [initialized]);

    const addAdmin = async (adminId) => {
        try {
            if (!initialized) return;

            if (!adminId) {
                toast.error('Please enter a user ID.');
                return;
            }

            if (adminId === userData?.id) {
                toast.error('You cannot add yourself as an admin.');
                return;
            }

            if (admins?.find((admin) => admin?.users?.id === adminId)) {
                toast.error('This user is already an admin.');
                return;
            }

            const { error } = await supabase
                .from('admins')
                .insert(
                    {
                        user_id: adminId,
                    },
                    {
                        returning: 'minimal',
                    }
                )
                .single();

            if (error) throw new Error(error);

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', adminId)
                .single();

            if (userError) throw new Error(userError);

            setAdmins((prevAdmins) => [
                ...prevAdmins,
                {
                    id: adminId,
                    users: userData,
                },
            ]);
            toast.success('Admin added successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showAdminCreationModal = () =>
        modals.openModal({
            title: <div className="font-bold">Add new admin</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <CreateAdminForm
                        closeModal={closeModal}
                        onCreate={(adminId) => addAdmin(adminId)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="flex mb-4">
                <Title label="Admins" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={showAdminCreationModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <AdminsTable admins={admins} loading={loading} setter={setAdmins} />
        </div>
    ) : (
        <div></div>
    );
}
