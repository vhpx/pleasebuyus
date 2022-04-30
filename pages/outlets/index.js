import { PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import ImageCard from '../../components/cards/ImageCard';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

const myOutlets = [];

const otherOutlets = [
    {
        id: 1,
        name: 'Apple',
        address: 'Cupertino, California, USA',
        imageUrl:
            'https://static.kinhtedothi.vn/images/upload/2022/03/22/p.png',
    },
    {
        id: 2,
        name: 'Amazon',
        address: 'Seattle, Washington, USA',
        imageUrl: 'https://phongduy.vn/wp-content/uploads/2021/01/amazon-1.jpg',
    },
    {
        id: 3,
        name: 'Google',
        address: 'Mountain View, California, USA',
        imageUrl:
            'https://media1.nguoiduatin.vn/media/vu-thu-huong/2019/12/19/anh-google.png',
    },
];

OutletsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletsPage() {
    const router = useRouter();

    const navigateToCreateOutlet = () => {
        router.push('/outlets/create');
    };

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <div className="flex">
                    <Title label="Your outlets" />
                    <button
                        className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                        onClick={navigateToCreateOutlet}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {myOutlets && myOutlets.length > 0 ? (
                        myOutlets.map((outlet) => (
                            <ImageCard
                                key={outlet.id}
                                name={outlet.name}
                                desc={outlet.address}
                                imageUrl={outlet.imageUrl}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col space-y-2 items-center">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                You don&apos;t have any outlets yet.
                            </p>

                            <button
                                className="flex items-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                onClick={navigateToCreateOutlet}
                            >
                                <PlusIcon className="w-4 h-4" />
                                <div>Create your first outlet</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Discover" />
                <Divider />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {otherOutlets.map((outlet) => (
                        <ImageCard
                            key={outlet.name}
                            name={outlet.name}
                            desc={outlet.address}
                            imageUrl={outlet.imageUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
