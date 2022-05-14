import Title from '../../components/common/Title.js';
import BankCardsTable from '../../components/dashboard/BankCardsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

BankCardsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BankCardsDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Bank Cards" className="mb-4" />
            <BankCardsTable />
        </div>
    );
}
