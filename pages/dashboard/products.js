import Title from '../../components/common/Title.js';
import ProductsTable from '../../components/dashboard/ProductsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

ProductsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function ProductsDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Products" className="mb-4" />
            <ProductsTable />
        </div>
    );
}
