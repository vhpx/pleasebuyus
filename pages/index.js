import { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import { StoreLayout } from '../components/layout/layout';
import Title from '../components/typography/Title';
import { supabase } from '../utils/supabase-client';
import { toast } from 'react-toastify';
import Divider from '../components/common/Divider';
import ProductCard from '../components/cards/ProductCard';
import LoadingIndicator from '../components/common/LoadingIndicator';

Home.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function Home() {
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingMostPopularProducts, setLoadingMostPopularProducts] =
        useState(true);

    const [mostPopularProducts, setMostPopularProducts] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;
                setProducts(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchProductsSold = async () => {
            try {
                const { data, error } = await supabase
                    .from('bill_products')
                    .select('amount, products (*)')
                    .limit(50);

                if (error) throw error;

                // Merge products' quantity with the same product id
                const productsSold = data
                    .reduce((acc, curr) => {
                        const product = acc.find(
                            (i) => i.id === curr.products.id
                        );

                        if (product) {
                            product.quantity += curr.amount;
                        } else {
                            acc.push({
                                ...curr.products,
                                quantity: curr.amount,
                            });
                        }

                        return acc;
                    }, [])
                    .sort((a, b) => b.quantity - a.quantity);

                setMostPopularProducts(productsSold);
                console.log(productsSold);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingMostPopularProducts(false);
            }
        };

        const fetchAll = async () => {
            await Promise.all([fetchProducts(), fetchProductsSold()]);
        };

        fetchAll();
    }, []);

    useEffect(() => {
        if (mostPopularProducts) {
            const displayedProducts = mostPopularProducts.slice(0, 12);

            // remove displayed products from products
            setProducts((prevProducts) => {
                return prevProducts.filter(
                    (product) =>
                        !displayedProducts.find((i) => i.id === product.id)
                );
            });
        }
    }, [mostPopularProducts]);

    return (
        <Container>
            <Title label="Featured products" />
            <Divider />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-8">
                {loadingMostPopularProducts ? (
                    <div className="w-full text-center col-span-full">
                        <LoadingIndicator svgClassName="h-8 w-8" />
                    </div>
                ) : mostPopularProducts && mostPopularProducts.length > 0 ? (
                    mostPopularProducts.slice(0, 12).map((product) => (
                        <div className="relative" key={product.id}>
                            <ProductCard product={product} aspectVideo={true} />
                            <div className="absolute top-3 right-3">
                                <span className="w-fit rounded-lg bg-black text-white px-2 py-1 font-semibold transition duration-300 text-center mb-2">
                                    {product.quantity} sold
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-zinc-600 dark:text-zinc-400">
                        No products found.
                    </p>
                )}
            </div>

            <Title label="Other products" />
            <Divider />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
        </Container>
    );
}
