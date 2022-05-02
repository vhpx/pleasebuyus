import { PlusIcon } from '@heroicons/react/outline';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import ItemCard from '../../components/cards/ItemCard';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import FormInput from '../../components/form/FormInput';
import { StoreLayout } from '../../components/layout/layout';

OutletEditionPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletEditionPage() {
    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <Title label="Information"></Title>
                    <Divider />
                    <div className="w-2/3 grid grid-cols-2 gap-x-8">
                        <FormInput label="Name" />
                        <FormInput label="Address" />
                    </div>
                    <div className="w-2/5 mt-7">
                        <OutlinedButton label="Save outlet" />
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <div className="flex">
                        <Title label="All items"></Title>
                        <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-4 gap-x-12 gap-y-6">
                        <ItemCard
                            name="MSI GF63 Thin and Light"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                        <ItemCard
                            name="Asus Rog Strix G513IH-HN006 15.6"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                        <ItemCard
                            name="Laptop Acer Aspire 7 A715 75G 58U4"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                        <ItemCard
                            name="MSI GF63 Thin and Light"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                        <ItemCard
                            name="Asus Rog Strix G513IH-HN006 15.6"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                        <ItemCard
                            name="Laptop Acer Aspire 7 A715 75G 58U4"
                            price="$1,999.00"
                            star="5 stars"
                            numSold="30"
                            hideButton={true}
                            imageUrl="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        ></ItemCard>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <div className="flex">
                        <Title label="All categories"></Title>
                        <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-4 gap-4">
                        <Card>Category 1</Card>
                        <Card>Category 1</Card>
                        <Card>Category 1</Card>
                        <Card>Category 1</Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
