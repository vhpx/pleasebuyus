import { useRouter } from 'next/router';
import ItemCard from '../../../components/cards/ItemCard';
import Card from '../../../components/common/Card';
import { StoreLayout } from '../../../components/layout/layout';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase-client';
import ImageCard from '../../../components/cards/ImageCard';
import BetterLink from '../../../components/link/BetterLink';
import { useUser } from '../../../hooks/useUser';
import ProductCard from '../../../components/cards/ProductCard';
import LoadingIndicator from '../../../components/common/LoadingIndicator';

DetailedOutletPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedOutletPage() {
    const router = useRouter();
    const { user } = useUser();

    const { outletId } = router.query;
    const [loadingSettings, setLoadingSettings] = useState(false);

    const [outlet, setOutlet] = useState(null);
    const [loadingOutlet, setLoadingOutlet] = useState(true);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

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
