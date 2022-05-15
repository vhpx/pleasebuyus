import { useState } from 'react';
import FormInput from '../form/FormInput';

export default function AdminEditProductForm({
    product,
    closeModal,
    onCreate,
    onDelete,
}) {
    const [outletId, setOutletId] = useState(product?.outlet_id || '');
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price || '');

    return (
        <>
            <FormInput
                label="Outlet ID"
                id="outlet-id"
                value={outletId}
                setter={setOutletId}
                required
            />

            <FormInput
                label="Name"
                id="name"
                value={name}
                setter={setName}
                required
            />

            <FormInput
                label="Description"
                id="description"
                value={description}
                setter={setDescription}
                required
            />

            <FormInput
                label="Price"
                id="price"
                value={price}
                setter={setPrice}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setOutletId(null);
                        setName(null);
                        setDescription(null);
                        setPrice(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {product && product?.id && (
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
                            id: product?.id,
                            outlet_id: outletId,
                            name,
                            description,
                            price,
                        })
                    }
                >
                    {product?.id ? 'Update' : 'Create'}
                </button>
            </div>
        </>
    );
}
