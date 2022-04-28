import OutlinedButton from '../../components/buttons/OutlinedButton';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import FormInput from '../../components/form/FormInput';
import FormLabel from '../../components/form/FormLabel';
import { StoreLayout } from '../../components/layout/layout';

OutletCreationPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletCreationPage() {
    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8">
                <Title label="Create your outlet" />
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <FormInput label="Name" />
                    <FormInput label="Address" />
                </div>
                <div className="flex justify-end mt-3">
                    <OutlinedButton label="Create outlet" />
                </div>
            </div>
        </div>
    );
}
