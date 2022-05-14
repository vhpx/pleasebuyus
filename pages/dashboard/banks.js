import Title from '../../components/common/Title.js';
import BanksTable from '../../components/dashboard/BanksTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

BanksDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BanksDashboardPage() {
    RequireAuth();

    const router = useRouter();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            <Title label="Banks" className="mb-4" />
            <BanksTable />
        </div>
    ) : (
        <div></div>
    );
}
