import { PencilIcon } from '@heroicons/react/outline';
import Card from '../common/Card';
import Divider from '../common/Divider';

export default function AddressCard({ address: currentAddress, onEdit }) {
    const { name, country, province, city, streetInfo } = currentAddress;

    return (
        <Card className="w-full min-h-[8rem] flex flex-col justify-between p-4 border dark:border-zinc-700/70 rounded-lg">
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold">{name}</h3>
                    <button
                        className="flex items-center justify-center font-semibold space-x-2 p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        onClick={onEdit}
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                </div>
                <Divider />

                <p>{country}</p>
                <p>{province}</p>
                <p>{city}</p>
                <p>{streetInfo}</p>
            </div>
        </Card>
    );
}
