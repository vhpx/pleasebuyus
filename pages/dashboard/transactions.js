import Title from '../../components/common/Title.js';
import TransactionsTable from '../../components/dashboard/TransactionsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

TransactionsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function TransactionsDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Transactions" className="mb-4" />
            <TransactionsTable />
        </div>
    );
}
