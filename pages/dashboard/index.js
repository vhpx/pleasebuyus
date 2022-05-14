import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth } from '../../hooks/useUser';

AdminDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function AdminDashboardPage() {
    RequireAuth();

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg"></div>
        </div>
    );
}
