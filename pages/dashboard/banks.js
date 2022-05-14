import Title from '../../components/common/Title.js';
import BanksTable from '../../components/dashboard/BanksTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

BanksDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BanksDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Banks" className="mb-4" />
            <BanksTable />
        </div>
    );
}
