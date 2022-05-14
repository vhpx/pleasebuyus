import Title from '../../components/common/Title.js';
import UsersTable from '../../components/dashboard/UsersTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

UsersDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function UsersDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Users" className="mb-4" />
            <UsersTable />
        </div>
    );
}
