import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import Card from '../components/common/Card';
import Container from '../components/common/Container';
import { StoreLayout } from '../components/layout/layout';
import Title from '../components/typography/Title';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/currency-format';

Home.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function Home() {
    const items_data = [
        {
            id: 1,
            name: 'Asus Rog Strix G513IH-HN006 15.6',
            description:
                'R7-4800H/16GB/512GB SSD/GTX 1650 4GB Gaming Laptop Black',
            price: 1349.99,
        },
        {
            id: 2,
            name: 'MSI GF63 Thin and Light',
            description: 'MSI GF63 Thin and Light',
            price: 1999,
        },
        {
            id: 3,
            name: 'Laptop Acer Aspire 7 A715 75G 58U4',
            description:
                'NVIDIA GeForce GTX 1650 4GB GDDR6 + Intel UHD Graphics',
            price: 899.49,
        },
        {
            id: 4,
            name: 'Laptop gaming Acer Nitro 5 Eagle AN515 57 54MV',
            description:
                'NVIDIA® GeForce RTX™ 3050 4GB GDDR6 + Intel® Core i5-11400H upto 4.50 GHz, 6 cores 12 threads',
            price: 1099,
        },
    ];

    const { items, addItem, removeItem } = useCart();

    return (
        <Container>
            <Title label="Electronics" />
            <div className="col-span-full mb-4 text-xl font-semibold dark:text-white">
                Computers and accessories
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items_data.map((item) => (
                    <Card
                        key={item.id}
                        className="flex flex-col justify-between"
                    >
                        <div className="mb-2">
                            <div className="font-semibold">{item.name}</div>
                            <div>{item.description}</div>
                        </div>

                        <div className="flex w-full items-end justify-between">
                            <div className="font-semibold text-blue-600 dark:text-blue-300">
                                {formatCurrency(item.price)}
                            </div>

                            {items.findIndex((i) => i.id === item.id) === -1 ? (
                                <button
                                    onClick={() => addItem(item)}
                                    className="rounded-full border-2 border-blue-500/70 dark:border-blue-300 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-blue-300 text-blue-700/70 dark:text-blue-300 dark:hover:text-black hover:text-white font-semibold px-4 py-1 transition duration-300"
                                >
                                    Add to cart
                                </button>
                            ) : (
                                <div className="flex items-center rounded-full border bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-700">
                                    <button
                                        onClick={() =>
                                            removeItem(item.id, item.name)
                                        }
                                        className="p-2"
                                    >
                                        <MinusIcon className="h-4 w-4 font-semibold" />
                                    </button>
                                    <div className="px-2 font-semibold">
                                        {
                                            items.find((i) => i.id === item.id)
                                                .quantity
                                        }
                                    </div>
                                    <button
                                        onClick={() => addItem(item)}
                                        className="p-2"
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
