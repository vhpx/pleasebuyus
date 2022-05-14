import Title from '../../components/common/Title.js';
import CouponsTable from '../../components/dashboard/CouponsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

CouponsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function CouponsDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Coupons" className="mb-4" />
            <CouponsTable />
        </div>
    );
}
