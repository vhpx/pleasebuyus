import Title from '../../components/common/Title.js';
import ProductsTable from '../../components/dashboard/ProductsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PlusIcon } from '@heroicons/react/outline';
import { supabase } from '../../utils/supabase-client.js';
import { useModals } from '@mantine/modals';
import AdminEditProductForm from '../../components/forms/AdminEditProductForm.js';

ChartJS.register(ArcElement, Tooltip, Legend);

ProductsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function ProductsDashboardPage() {
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

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase
                    .from('products')
                    .select('*, outlets (*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProducts(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (product) => {
        try {
            if (!product) throw new Error("Product doesn't exist");

            // get non-null values
            const newProduct = {
                ...Object.fromEntries(
                    Object.entries(product).filter(
                        ([key, value]) => value !== null
                    )
                ),
            };

            delete newProduct.id;

            const { data, error } = await supabase
                .from('products')
                .insert(newProduct)
                .single();

            if (error) throw error;

            setProducts((products) => [...products, data]);
            toast.success('Product added successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeModal();
        }
    };

    const showCreateProductModal = (product) =>
        modals.openModal({
            title: <div className="font-bold">Create new product</div>,
            centered: true,
            overflow: 'inside',
            children: (
                <div className="p-1">
                    <AdminEditProductForm
                        product={product}
                        closeModal={closeModal}
                        onCreate={(product) => addProduct(product)}
                    />
                </div>
            ),
            onClose: () => {},
        });

    const getDistinctOutlets = () => {
        return products.reduce((acc, product) => {
            if (acc.includes(product?.outlets?.name)) return acc;
            return [...acc, product?.outlets?.name];
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {products && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: [
                                        'Less than $5',
                                        '$5 - $20',
                                        '$20 - $50',
                                        '$50 - $100',
                                        '$100 - $500',
                                        '$500+',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Prices',
                                            data: [
                                                products.filter(
                                                    (product) =>
                                                        product.price < 5
                                                ).length,
                                                products.filter(
                                                    (product) =>
                                                        product.price >= 5 &&
                                                        product.price < 20
                                                ).length,
                                                products.filter(
                                                    (product) =>
                                                        product.price >= 20 &&
                                                        product.price < 50
                                                ).length,
                                                products.filter(
                                                    (product) =>
                                                        product.price >= 50 &&
                                                        product.price < 100
                                                ).length,
                                                products.filter(
                                                    (product) =>
                                                        product.price >= 100 &&
                                                        product.price < 500
                                                ).length,
                                                products.filter(
                                                    (product) =>
                                                        product.price >= 500
                                                ).length,
                                            ],
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
                                Price range
                            </div>
                        </div>

                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctOutlets(),
                                    datasets: [
                                        {
                                            label: 'Outlets',
                                            data: getDistinctOutlets().map(
                                                (outlet) =>
                                                    products.filter(
                                                        (product) =>
                                                            product?.outlets
                                                                ?.name ===
                                                            outlet
                                                    ).length
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
                                Outlet products count
                            </div>
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

            <div className="flex mb-4">
                <Title label="Products" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    onClick={() => showCreateProductModal()}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <ProductsTable
                products={products}
                loading={loading}
                setter={setProducts}
            />
        </div>
    ) : (
        <div></div>
    );
}
