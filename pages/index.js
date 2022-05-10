import { useEffect, useState } from 'react';
import Container from '../components/common/Container';
import { StoreLayout } from '../components/layout/layout';
import Title from '../components/typography/Title';
import { supabase } from '../utils/supabase-client';
import { toast } from 'react-toastify';
import Divider from '../components/common/Divider';
import ProductCard from '../components/cards/ProductCard';

Home.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function Home() {
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
            }
        };
        fetchProducts();
    }, []);

    return (
        <Container>
            <Title label="All products" />
            <Divider />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </Container>
    );
}
