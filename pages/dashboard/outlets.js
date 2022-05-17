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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

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

    const [outletSales, setOutletSales] = useState([]);

    useEffect(() => {
        const fetchOutlets = async () => {
            if (!initialized) return;

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
    }, [initialized]);

    useEffect(() => {
        const fetchOutletSales = async () => {
            if (!initialized) return;
            if (!outlets && !outlets.length) return;

            const { data, error } = await supabase
                .from('bill_products')
                .select('amount, bills (outlet_id), products (price)');

            if (error) throw error;

            const outletSales = data.reduce((acc, curr) => {
                const outlet = acc.find(
                    (outlet) => outlet.id === curr.bills.outlet_id
                );

                const outletName = outlets.find(
                    (outlet) => outlet.id === curr.bills.outlet_id
                )?.name;

                if (!outlet) {
                    acc.push({
                        id: curr.bills.outlet_id,
                        name: outletName,
                        sales: curr.amount,
                        earnings: curr.amount * curr.products.price,
                    });
                } else {
                    outlet.sales += curr.amount;
                    outlet.earnings += curr.amount * curr.products.price;
                }
                return acc;
            }, []);

            console.log(outletSales);
            setOutletSales(outletSales);
        };

        fetchOutletSales();
    }, [initialized, outlets]);

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

    const getDistinctOutletNames = () => {
        if (!outletSales) return [];

        return outletSales.reduce((acc, curr) => {
            if (!acc.includes(curr.name)) {
                acc.push(curr.name);
            }
            return acc;
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {outletSales && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctOutletNames(),
                                    datasets: [
                                        {
                                            label: 'Sales',
                                            data: outletSales.map(
                                                (outlet) => outlet.sales
                                            ),
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Most popular outlets
                            </div>
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctOutletNames(),
                                    datasets: [
                                        {
                                            label: 'Sales',
                                            data: outletSales.map(
                                                (outlet) => outlet.earnings
                                            ),
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                                'rgba(153, 102, 255, 0.2)',
                                                'rgba(255, 159, 64, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                                'rgba(75, 192, 192, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                                'rgba(153, 102, 255, 1)',
                                                'rgba(255, 159, 64, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                                'rgba(75, 192, 192, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                            <div className="mt-2 mb-4 text-2xl text-center font-semibold">
                                Top earning outlets
                            </div>
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

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
