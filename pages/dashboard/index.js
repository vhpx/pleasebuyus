import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase-client.js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Title from '../../components/common/Title.js';

AdminDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function AdminDashboardPage() {
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

    const [usersCount, setUsersCount] = useState({
        total: null,
        loading: true,
    });

    const [banksCount, setBanksCount] = useState({
        total: null,
        loading: true,
    });

    const [bankCardsCount, setBankCardsCount] = useState({
        total: null,
        loading: true,
    });

    const [outletsCount, setOutletsCount] = useState({
        total: null,
        loading: true,
    });

    const [productsCount, setProductsCount] = useState({
        total: null,
        loading: true,
    });

    const [couponsCount, setCouponsCount] = useState({
        total: null,
        loading: true,
    });

    const [categoriesCount, setCategoriesCount] = useState({
        total: null,
        loading: true,
    });

    const [transactionsCount, setTransactionsCount] = useState({
        total: null,
        loading: true,
    });

    const [adminsCount, setAdminsCount] = useState({
        total: null,
        loading: true,
    });

    useEffect(() => {
        const fetchUsersCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                setUsersCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setUsersCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchBanksCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('banks')
                    .select('code', { count: 'exact' });

                if (error) throw error;
                setBanksCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setBanksCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchBankCardsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('bank_cards')
                    .select('bank_code', { count: 'exact' });

                if (error) throw error;
                setBankCardsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setBankCardsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchOutletsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('outlets')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                setOutletsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setOutletsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchProductsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                setProductsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setProductsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchCouponsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('coupons')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                setCouponsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setCouponsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchCategoriesCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('global_categories')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                console.log(data);
                setCategoriesCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setCategoriesCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchTransactionsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('bills')
                    .select('id', { count: 'exact' });

                if (error) throw error;
                setTransactionsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setTransactionsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchAdminsCount = async () => {
            try {
                const { data, error } = await supabase
                    .from('admins')
                    .select('user_id', { count: 'exact' });

                if (error) throw error;
                setAdminsCount((prevState) => ({
                    ...prevState,
                    total: data?.length || 0,
                }));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setAdminsCount((prevState) => ({
                    ...prevState,
                    loading: false,
                }));
            }
        };

        const fetchAll = async () => {
            if (!initialized) return;

            await Promise.all([
                fetchUsersCount(),
                fetchBanksCount(),
                fetchBankCardsCount(),
                fetchOutletsCount(),
                fetchProductsCount(),
                fetchCouponsCount(),
                fetchCategoriesCount(),
                fetchTransactionsCount(),
                fetchAdminsCount(),
            ]);
        };

        fetchAll();
    }, [initialized]);

    return (
        <div className="p-4 md:p-8 lg:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Title label="Dashboard overview" className="col-span-full" />

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {usersCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total users
                        </div>
                        <div className="text-5xl font-semibold">
                            {usersCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {banksCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total banks
                        </div>
                        <div className="text-5xl font-semibold">
                            {banksCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {bankCardsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total bank cards
                        </div>
                        <div className="text-5xl font-semibold">
                            {bankCardsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {outletsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total outlets
                        </div>
                        <div className="text-5xl font-semibold">
                            {outletsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {productsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total products
                        </div>
                        <div className="text-5xl font-semibold">
                            {productsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {couponsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total coupons
                        </div>
                        <div className="text-5xl font-semibold">
                            {couponsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {categoriesCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total categories
                        </div>
                        <div className="text-5xl font-semibold">
                            {categoriesCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {transactionsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total transactions
                        </div>
                        <div className="text-5xl font-semibold">
                            {transactionsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                {adminsCount.loading ? (
                    <div className="text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-bold text-zinc-500">
                            Total admins
                        </div>
                        <div className="text-5xl font-semibold">
                            {adminsCount?.total ?? 'No data.'}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
