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
        fetchProducts();
    }, []);

    return (
        <Container>
            <Title label="All products" />
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
