import Title from '../../components/common/Title.js';
import AddressesTable from '../../components/dashboard/AddressesTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PlusIcon } from '@heroicons/react/outline';
import { supabase } from '../../utils/supabase-client.js';
import EditAddressForm from '../../components/forms/EditAddressForm.js';
import { useModals } from '@mantine/modals';

ChartJS.register(ArcElement, Tooltip, Legend);

AddressesDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function AddressesDashboardPage() {
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

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('addresses')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAddresses(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const addAddress = async (address) => {
        try {
            if (!address) throw new Error("Address doesn't exist");

            // get non-null values
            const newAddress = {
                ...Object.fromEntries(
                    Object.entries(address).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            const { data, error } = await supabase
                .from('addresses')
                .insert(newAddress)
                .single();

            if (error) throw error;

            setter((prevState) => {
                const newState = [...prevState];
                const index = newState.findIndex(
                    (address) => address.id === data.id
                );

                newState[index] = data;
                return newState;
            });
            toast.success('Address updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showAddAddressModal = (address) =>
        modals.openModal({
            title: <div className="font-bold">Add new address</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <EditAddressForm
                        address={address}
                        closeModal={closeModal}
                        onCreate={(address) => addAddress(address)}
                        setter={setAddresses}
                        showUIDField
                    />
                </div>
            ),
            onClose: () => {},
        });

    const getDistinctCountries = () => {
        return addresses.reduce((acc, address) => {
            if (acc.includes(address.country)) return acc;
            return [...acc, address.country];
        }, []);
    };

    const getDistinctCities = () => {
        return addresses.reduce((acc, address) => {
            if (acc.includes(address.city)) return acc;
            return [...acc, address.city];
        }, []);
    };

    const getDistinctProvinces = () => {
        return addresses.reduce((acc, address) => {
            if (acc.includes(address.province)) return acc;
            return [...acc, address.province];
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {addresses && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctCountries(),
                                    datasets: [
                                        {
                                            label: 'Countries',
                                            data: [
                                                // For each country, count the number of addresses
                                                ...getDistinctCountries().map(
                                                    (country) =>
                                                        addresses.reduce(
                                                            (acc, address) =>
                                                                address.country ==
                                                                country
                                                                    ? acc + 1
                                                                    : acc,
                                                            0
                                                        )
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctProvinces(),
                                    datasets: [
                                        {
                                            label: 'Provinces',
                                            data: [
                                                // For each country, count the number of addresses
                                                ...getDistinctProvinces().map(
                                                    (province) =>
                                                        addresses.reduce(
                                                            (acc, address) =>
                                                                address.province ==
                                                                province
                                                                    ? acc + 1
                                                                    : acc,
                                                            0
                                                        )
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctCities(),
                                    datasets: [
                                        {
                                            label: 'Cities',
                                            data: [
                                                // For each country, count the number of addresses
                                                ...getDistinctCities().map(
                                                    (city) =>
                                                        addresses.reduce(
                                                            (acc, address) =>
                                                                address.city ==
                                                                city
                                                                    ? acc + 1
                                                                    : acc,
                                                            0
                                                        )
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

            <div className="flex mb-4">
                <Title label="Addresses" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={showAddAddressModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <AddressesTable
                addresses={addresses}
                loading={loading}
                setter={setAddresses}
            />
        </div>
    ) : (
        <div></div>
    );
}
