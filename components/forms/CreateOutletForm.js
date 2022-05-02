import { useState } from 'react';
import FormInput from '../form/FormInput';

export default function CreateOutletForm({ closeModal, onCreate }) {
    const [newOutletName, setNewOutletName] = useState('');
    const [newOutletAddress, setNewOutletAddress] = useState('');

    return (
        <>
            <FormInput
                label="Outlet name"
                id="outlet-name"
                type="text"
                placeholder="Enter outlet name"
                setter={setNewOutletName}
                required
            />

            <FormInput
                label="Outlet address"
                id="outlet-address"
                type="text"
                placeholder="Enter outlet address"
                setter={setNewOutletAddress}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setNewOutletName('');
                        setNewOutletAddress('');

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => onCreate(newOutletName, newOutletAddress)}
                >
                    Continue
                </button>
            </div>
        </>
    );
}
