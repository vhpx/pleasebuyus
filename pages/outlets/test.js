import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

OutletCreationPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletCreationPage() {
    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Detailed Outlet Page" />
                <Divider />
            </div>
        </div>
    );
}
