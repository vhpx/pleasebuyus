import Title from '../../components/common/Title.js';
import OutletsTable from '../../components/dashboard/OutletsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

OutletsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function OutletsDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Outlets" className="mb-4" />
            <OutletsTable />
        </div>
    );
}
