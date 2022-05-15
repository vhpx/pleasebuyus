import { useState } from 'react';
import FormInput from '../form/FormInput';

export default function EditOutletForm({
    outlet,
    closeModal,
    onCreate,
    onDelete,
}) {
    const [name, setName] = useState(outlet?.name || '');
    const [address, setAddress] = useState(outlet?.address || '');
    const [ownerId, setOwnerId] = useState(outlet?.owner_id || '');

    return (
        <>
            <FormInput
                label="Name"
                id="name"
                value={name}
                setter={setName}
                required
            />

            <FormInput
                label="Address"
                id="address"
                value={address}
                setter={setAddress}
                required
            />

            <FormInput
                label="Owner ID"
                id="owner_id"
                value={ownerId}
                setter={setOwnerId}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setName(null);
                        setAddress(null);
                        setOwnerId(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {outlet && outlet?.id && (
                    <button
                        className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                )}

                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() =>
                        onCreate({
                            id: outlet?.id,
                            name,
                            address,
                            owner_id: ownerId,
                        })
                    }
                >
                    {outlet?.id ? 'Update' : 'Create'}
                </button>
            </div>
        </>
    );
}
