import { useRouter } from 'next/router';
import ItemCard from '../../../components/cards/ItemCard';
import Card from '../../../components/common/Card';
import { StoreLayout } from '../../../components/layout/layout';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase-client';
import ImageCard from '../../../components/cards/ImageCard';
import BetterLink from '../../../components/link/BetterLink';

DetailedOutletPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function DetailedOutletPage() {
    const router = useRouter();
    const { outletId } = router.query;

    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);

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
                console.log(outletData);

                setOutlet(outletData);
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchOutlet();
    }, [outletId]);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="flex justify-between items-start bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex items-end">
                    <ImageCard
                        imageUrl={outlet?.image_url}
                        hideContent={true}
                    />

                    <div className="ml-5 space-y-2">
                        <div className="text-4xl font-semibold">
                            {outlet?.name}
                        </div>

                        <div className="text-sm">{outlet?.address}</div>
                    </div>
                </div>

                <BetterLink
                    href={`/outlets/${outlet?.id}/settings`}
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                >
                    Settings
                </BetterLink>
            </div>

            <div className="grid grid-cols-5 space-x-4">
                <Card>Voucher</Card>
                <Card>Voucher</Card>
                <Card>Voucher</Card>
                <Card>Voucher</Card>
                <Card>Voucher</Card>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex space-x-10">
                    <img
                        className="w-1/2 rounded-lg"
                        src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                    />
                    <div>
                        Lorem ipsum labore et dolore magna aliqua. Ut enim ad
                        minim veniam consequat. Duis aute irure dolor in
                        pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim
                        id est laborum. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. <br></br> Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum.
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <div className="flex space-x-1">
                    <Card>All</Card>
                    <Card>Category 1</Card>
                    <Card>Category 2</Card>
                    <Card>Category 3</Card>
                    <Card>Category 4</Card>
                    <Card>Category 5</Card>
                </div>
                <div className="text-right">Filter and sort</div>
                <div className="grid grid-cols-5 gap-x-5">
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
