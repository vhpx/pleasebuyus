import Divider from '../components/common/Divider';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';

PurchaseHistoryPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function PurchaseHistoryPage() {
    return (
        <div className="p-4 md:p-8 lg:p-16 ">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Purchase History" />
                <Divider />

                {/* Content */}
            </div>
        </div>
    );
}
