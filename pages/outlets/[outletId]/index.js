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

DetailedOutletPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedOutletPage() {
    const router = useRouter();
    const { user } = useUser();

    const { outletId } = router.query;

    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

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
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        const fetchCategories = async () => {
            try {
                if (!outletId) throw new Error('Outlet not found');

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

        const fetchAll = async () => {
            await Promise.all([fetchOutlet(), fetchCategories()]);
        };

        fetchAll();
    }, [outletId]);

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
                    <BetterLink
                        href={`/outlets/${outlet?.id}/settings`}
                        className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    >
                        Settings
                    </BetterLink>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex space-x-1">
                    {categories.map((category) => (
                        <Card key={category.id}>
                            <div className="text-sm font-semibold">
                                {category.name}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="text-right">Filter and sort</div>
                <div className="grid grid-cols-4 gap-4">
                    <ItemCard
                        name="MSI GF63 Thin and Light"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Asus Rog Strix G513IH-HN006 15.6"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Laptop Acer Aspire 7 A715 75G 58U4"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="MSI GF63 Thin and Light"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Asus Rog Strix G513IH-HN006 15.6"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Laptop Acer Aspire 7 A715 75G 58U4"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="MSI GF63 Thin and Light"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Asus Rog Strix G513IH-HN006 15.6"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Laptop Acer Aspire 7 A715 75G 58U4"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="MSI GF63 Thin and Light"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Asus Rog Strix G513IH-HN006 15.6"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                    <ItemCard
                        name="Laptop Acer Aspire 7 A715 75G 58U4"
                        price="$1,999.00"
                        star="5 stars"
                        numSold="30"
                        imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    ></ItemCard>
                </div>
            </div>
        </div>
    );
}
