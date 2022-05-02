import ItemCard from '../../components/cards/ItemCard';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

OutletCreationPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletCreationPage() {
    return (
        <>
            <div className="p-4 md:p-8 lg:p-16">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <Title label="Detailed Outlet Page" />
                    <Divider />
                    <div className="flex">
                        <div className="w-3/5 flex items-center">
                            <img
                                className="rounded-full w-44 h-44"
                                src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                            />
                            <div className=" text-4xl ml-5 font-semibold">
                                Name
                            </div>
                        </div>
                        <div className="w-2/5 grid grid-cols-2 ">
                            <div>Items: 0</div>
                            <div>Rating: 0</div>
                            <div>Followers: 0</div>
                            <div>Following: 0</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-16">
                <div className="flex space-x-20">
                    <Card>Voucher</Card>
                    <Card>Voucher</Card>
                    <Card>Voucher</Card>
                    <Card>Voucher</Card>
                    <Card>Voucher</Card>
                </div>
            </div>
            <div className="p-4 md:px-8 lg:px-16">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                    <div className="flex space-x-10">
                        <img
                            className="w-1/2 rounded-lg"
                            src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wqHR?ver=1b58"
                        />
                        <div>
                            Lorem ipsum labore et dolore magna aliqua. Ut enim
                            ad minim veniam consequat. Duis aute irure dolor in
                            pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit
                            anim id est laborum. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.{' '}
                            <br></br> Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 md:p-8 lg:p-16">
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
        </>
    );
}
