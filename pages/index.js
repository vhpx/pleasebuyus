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
                                <button
                                    onClick={() => addItem(product)}
                                    className="rounded-full border-2 border-zinc-500/70 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-white/10 text-zinc-700/70 dark:text-zinc-300 dark:hover:text-white hover:text-white font-semibold px-4 py-1 transition duration-300"
                                >
                                    Add to cart
                                </button>
                            ) : (
                                <div className="flex py-[1px] items-center rounded-full border bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                                    <button
                                        onClick={() =>
                                            removeItem(product.id, product.name)
                                        }
                                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition duration-300"
                                    >
                                        <MinusIcon className="h-4 w-4 font-semibold" />
                                    </button>
                                    <div className="px-2 min-w-[3rem] text-center font-semibold">
                                        {
                                            cartItems.find(
                                                (i) => i.id === product.id
                                            ).quantity
                                        }
                                    </div>
                                    <button
                                        onClick={() => addItem(product)}
                                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition duration-300"
                                    >
                                        <PlusIcon className="h-4 w-4 font-semibold" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </Container>
    );
}
