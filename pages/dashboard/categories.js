import Title from '../../components/common/Title.js';
import CategoriesTable from '../../components/dashboard/CategoriesTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

CategoriesDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function CategoriesDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Categories" className="mb-4" />
            <CategoriesTable />
        </div>
    );
}
