import { PlusIcon } from '@heroicons/react/outline';
import ImageCard from '../../components/cards/ImageCard';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';

const outlets = [
    {
        name: 'Apple',
        address: 'District 7',
    },
    {
        name: 'Amazon',
        address: 'District 7',
    },
];

OutletsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function OutletsPage() {
    return (
        <div className="p-4 md:p-8 lg:p-16 ">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <div className="flex">
                    <Title label="List of outlets" />
                    <button className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <div className=" grid grid-cols-4 gap-x-6">
                    <ImageCard
                        src="https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg"
                        desc="Tan Phong ward, district 7, HCMC"
                        name="Apple"
                    />

                    <ImageCard
                        src="https://xuconcept.com/wp-content/uploads/2021/11/tai-hinh-nen-mien-phi.jpg"
                        desc="Tan Phong ward, district 7, HCMC"
                        name="Apple"
                    />
                </div>
            </div>
        </div>
    );
}
