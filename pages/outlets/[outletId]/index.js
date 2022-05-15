import { useRouter } from 'next/router';
import { StoreLayout } from '../../../components/layout/layout';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase-client';
import ImageCard from '../../../components/cards/ImageCard';
import { useUser } from '../../../hooks/useUser';
import ProductCard from '../../../components/cards/ProductCard';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import { formatCurrency } from '../../../utils/currency-format';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

DetailedOutletPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedOutletPage() {
    const router = useRouter();
    const { user, userData } = useUser();

    const { outletId } = router.query;
    const [loadingSettings, setLoadingSettings] = useState(false);

    const [outlet, setOutlet] = useState(null);
    const [loadingOutlet, setLoadingOutlet] = useState(true);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [sales, setSales] = useState([]);
    const [totalSale, setTotalSale] = useState(0);
    const [loadingTotalSale, setLoadingTotalSale] = useState(true);

    const [totalProducts, setTotalProducts] = useState(0);
    const [loadingTotalProducts, setLoadingTotalProducts] = useState(true);

    const [soldProducts, setSoldProducts] = useState([]);
    const [totalItemsSold, setTotalItemsSold] = useState(0);
    const [loadingTotalItemsSold, setLoadingTotalItemsSold] = useState(true);

    useEffect(() => {
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
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingOutlet(false);
            }
        };

        const fetchCategories = async () => {
            try {
                if (!outletId) return;

                const { data, error } = await supabase
                    .from('outlet_categories')
                    .select('*')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setCategories([
                    {
                        id: 'all',
                        name: 'All',
                    },
                    ...data,
                ]);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchProducts = async () => {
            try {
                if (!outletId) return;

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setProducts(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchAll = async () => {
            await Promise.all([
                fetchOutlet(),
                fetchCategories(),
                fetchProducts(),
            ]);
        };

        fetchAll();
    }, [outletId]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                if (!outletId) return;

                const { data, error } = await supabase
                    .from('bills')
                    .select('total')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setSales(data);
                setTotalSale(data.reduce((acc, curr) => acc + curr.total, 0));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingTotalSale(false);
            }
        };

        const fetchTotalProducts = async () => {
            try {
                if (!outletId) return;

                const { data, error } = await supabase
                    .from('products')
                    .select('id')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setTotalProducts(data.length);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingTotalProducts(false);
            }
        };

        const fetchTotalProductsSold = async () => {
            try {
                if (!outletId) return;

                const { data, error } = await supabase
                    .from('bill_products')
                    .select('amount, products!inner(*)')
                    .eq('products.outlet_id', outletId);

                if (error) throw error;

                const total = data.reduce((acc, curr) => acc + curr.amount, 0);
                setTotalItemsSold(total);
                setSoldProducts(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingTotalItemsSold(false);
            }
        };

        const fetchAll = async () => {
            if (
                !userData?.isAdmin &&
                !(user?.id && outlet?.id && user.id === outlet?.owner_id)
            )
                return;

            await Promise.all([
                fetchSales(),
                fetchTotalProducts(),
                fetchTotalProductsSold(),
            ]);
        };

        fetchAll();
    }, [outlet, outletId, user, userData?.isAdmin]);

    const fetchProducts = async (categoryId) => {
        try {
            if (!outletId) return;
            setProducts([]);

            if (categoryId === 'all') {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('outlet_id', outletId);

                if (error) throw error;
                setProducts(data);
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('outlet_id', outletId)
                    .eq('category_id', categoryId);

                if (error) throw error;
                setProducts(data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId);
        setLoadingProducts(true);
        await fetchProducts(categoryId);
    };

    const getDistinctSoldProductNames = () => {
        const distinctProductNames = soldProducts.reduce((acc, curr) => {
            if (!acc.includes(curr.products.name)) acc.push(curr.products.name);
            return acc;
        }, []);
        return distinctProductNames;
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="flex justify-between items-start bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex items-end">
                    <ImageCard
                        imageUrl={outlet?.avatar_url}
                        hideContent={true}
                    />

                    <div className="ml-5 space-y-2">
                        <div className="text-4xl font-semibold">
                            {outlet?.name}
                        </div>

                        <div className="text-sm">{outlet?.address}</div>
                    </div>
                </div>

                {user?.id && outlet?.id && user.id === outlet?.owner_id && (
                    <button
                        className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        onClick={() => {
                            if (loadingSettings) return;
                            setLoadingSettings(true);
                            router.push(`/outlets/${outlet?.id}/settings`);
                        }}
                    >
                        {loadingSettings ? 'Loading...' : 'Settings'}
                    </button>
                )}
            </div>

            {(userData?.isAdmin ||
                (user?.id && outlet?.id && user.id === outlet?.owner_id)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                        {loadingTotalSale ? (
                            <div className="text-center">
                                <LoadingIndicator svgClassName="w-8 h-8" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-zinc-500">
                                    Total sale
                                </div>
                                <div className="text-5xl font-semibold">
                                    {totalSale != null
                                        ? formatCurrency(totalSale)
                                        : 'No data.'}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                        {loadingTotalProducts ? (
                            <div className="text-center">
                                <LoadingIndicator svgClassName="w-8 h-8" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-zinc-500">
                                    Total products
                                </div>
                                <div className="text-5xl font-semibold">
                                    {totalProducts != null
                                        ? totalProducts
                                        : 'No data.'}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                        {loadingTotalItemsSold ? (
                            <div className="text-center">
                                <LoadingIndicator svgClassName="w-8 h-8" />
                            </div>
                        ) : (
                            <>
                                <div className="text-3xl font-bold text-zinc-500">
                                    Total items sold
                                </div>
                                <div className="text-5xl font-semibold">
                                    {totalItemsSold ?? 'No data.'}
                                </div>
                            </>
                        )}
                    </div>

                    {getDistinctSoldProductNames().length > 0 && (
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctSoldProductNames(),
                                    datasets: [
                                        {
                                            label: 'Most popular products',
                                            // each number is the combined amount of each product with the same name
                                            data: getDistinctSoldProductNames().map(
                                                (name) =>
                                                    soldProducts.reduce(
                                                        (acc, curr) =>
                                                            curr.products
                                                                .name === name
                                                                ? acc +
                                                                  curr.amount
                                                                : acc,
                                                        0
                                                    )
                                            ),
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
                                Most popular products
                            </div>
                        </div>
                    )}

                    {getDistinctSoldProductNames().length > 0 && (
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctSoldProductNames(),
                                    datasets: [
                                        {
                                            label: 'Product sales',
                                            data: getDistinctSoldProductNames().map(
                                                (name) =>
                                                    soldProducts.reduce(
                                                        (acc, curr) =>
                                                            curr.products
                                                                .name === name
                                                                ? acc +
                                                                  curr.products
                                                                      .price *
                                                                      curr.amount
                                                                : acc,
                                                        0
                                                    )
                                            ),
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
                                Product sales
                            </div>
                        </div>
                    )}

                    {sales && sales.length > 0 && (
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: [
                                        'Less than 10$',
                                        '10$ - 20$',
                                        '20$ - 50$',
                                        '50$ - 100$',
                                        '100$ - 500$',
                                        '500$+',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Sales by margin',
                                            data: [
                                                sales.filter(
                                                    (sale) => sale.total < 10
                                                ).length,
                                                sales.filter(
                                                    (sale) =>
                                                        sale.total >= 10 &&
                                                        sale.total < 20
                                                ).length,
                                                sales.filter(
                                                    (sale) =>
                                                        sale.total >= 20 &&
                                                        sale.total < 50
                                                ).length,
                                                sales.filter(
                                                    (sale) =>
                                                        sale.total >= 50 &&
                                                        sale.total < 100
                                                ).length,
                                                sales.filter(
                                                    (sale) =>
                                                        sale.total >= 100 &&
                                                        sale.total < 500
                                                ).length,
                                                sales.filter(
                                                    (sale) => sale.total >= 500
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
                                Sales range
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex space-x-2">
                    {categories.map((category) => (
                        <button
                            className={`px-4 py-2 cursor-pointer rounded-lg border dark:border-zinc-700 transition duration-300
                            ${
                                selectedCategory === category.id
                                    ? 'bg-blue-500 text-white dark:bg-zinc-700/70'
                                    : 'hover:bg-blue-500 hover:text-white dark:hover:bg-zinc-800/70'
                            }
                            `}
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            <div className="text-sm font-semibold">
                                {category.name}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                    {loadingProducts ? (
                        <div className="w-full text-center col-span-full">
                            <LoadingIndicator svgClassName="h-8 w-8" />
                        </div>
                    ) : products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard product={product} key={product.id} />
                        ))
                    ) : (
                        <p className="text-zinc-600 dark:text-zinc-400">
                            No products found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
