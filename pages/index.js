import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Container from '../components/common/Container';
import { StoreLayout } from '../components/layout/layout';
import Title from '../components/typography/Title';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/currency-format';
import { supabase } from '../utils/supabase-client';
import { toast } from 'react-toastify';
import Divider from '../components/common/Divider';
import AddToCartButton from '../components/buttons/AddToCartButton';
import AmountAdjuster from '../components/buttons/AmountAdjuster';

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

    const { items: cartItems, addItem, removeItem } = useCart();

    return (
        <Container>
            <Title label="All products" />
            <Divider />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                    <Card
                        key={product.id}
                        className="flex flex-col justify-between"
                    >
                        <div className="aspect-video rounded-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="rounded-lg mb-2"
                                src={product.avatar_url}
                                alt={product.name}
                            />
                        </div>

                        <div className="mb-2">
                            <div className="font-semibold">{product.name}</div>
                            <div>{product.description}</div>
                        </div>

                        <div className="flex w-full items-end justify-between">
                            <div className="font-semibold text-blue-600 dark:text-blue-300">
                                {formatCurrency(product.price)}
                            </div>

                            {cartItems.findIndex((i) => i.id === product.id) ===
                            -1 ? (
                                <AddToCartButton
                                    onClick={() => addItem(product)}
                                />
                            ) : (
                                <AmountAdjuster
                                    amount={
                                        cartItems.find(
                                            (i) => i.id === product.id
                                        )?.quantity
                                    }
                                    onDecrement={() => removeItem(product.id)}
                                    onIncrement={() => addItem(product)}
                                />
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </Container>
    );
}
