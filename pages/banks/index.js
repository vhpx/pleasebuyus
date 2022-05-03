import { BankLayout } from '../../components/layout/layout';
import { RequireAuth } from '../../hooks/useUser';

BanksPage.getLayout = (page) => {
    return <BankLayout>{page}</BankLayout>;
};

export default function BanksPage() {
    RequireAuth();

    return <div></div>;
}
