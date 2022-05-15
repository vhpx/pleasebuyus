import Title from '../../components/common/Title.js';
import UsersTable from '../../components/dashboard/UsersTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { supabase } from '../../utils/supabase-client.js';

ChartJS.register(ArcElement, Tooltip, Legend);

UsersDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function UsersDashboardPage() {
    RequireAuth();

    const router = useRouter();

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

    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setUsers(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {users && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: [
                                        'Male',
                                        'Female',
                                        'Other',
                                        'Not settled',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Gender',
                                            data: [
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.gender == 'male'
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.gender == 'female'
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.gender == 'other'
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.gender !=
                                                            'male' &&
                                                        user?.gender !=
                                                            'female' &&
                                                        user?.gender != 'other'
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Gender
                            </div>
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: [
                                        'Has phone number',
                                        'No phone number',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Has phone number',
                                            data: [
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.phone_number
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                                users?.length -
                                                    users.reduce(
                                                        (acc, user) =>
                                                            user?.phone_number
                                                                ? acc + 1
                                                                : acc,
                                                        0
                                                    ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Phone number
                            </div>
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: ['Has birthday', 'No birthday'],
                                    datasets: [
                                        {
                                            label: 'Has birthday',
                                            data: [
                                                users.reduce(
                                                    (acc, user) =>
                                                        user?.birthday
                                                            ? acc + 1
                                                            : acc,
                                                    0
                                                ),
                                                users?.length -
                                                    users.reduce(
                                                        (acc, user) =>
                                                            user?.birthday
                                                                ? acc + 1
                                                                : acc,
                                                        0
                                                    ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Birthday
                            </div>
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

            <Title label="Users" className="mb-4" />
            <UsersTable users={users} loading={loading} setter={setUsers} />
        </div>
    ) : (
        <div></div>
    );
}
