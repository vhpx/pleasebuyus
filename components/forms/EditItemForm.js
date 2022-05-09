import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';

export default function EditItemForm({
    user,
    item: currentItem,
    closeModal,
    setter,
}) {
    const [itemName, setItemName] = useState(currentItem?.name || '');
    const [itemDescription, setItemDescription] = useState(
        currentItem?.description || ''
    );
    const [itemPrice, setItemPrice] = useState(currentItem?.price || '');
    const [itemImageUrl, setItemImageUrl] = useState(
        currentItem?.imageUrl || ''
    );

    const handleSubmit = async () => {
        try {
            if (!hasAddress()) throw new Error('Address is empty');
            if (!user) throw new Error('User is not logged in');

            if (currentAddress?.id == null || !isUUID(currentAddress?.id)) {
                const { data, error } = await supabase
                    .from('addresses')
                    .insert({
                        user_id: user?.id,
                        name: addressName,
                        country: country,
                        province: province,
                        city: city,
                        street_info: streetInfo,
                    })
                    .single();

                if (error) throw error;

                const newAddress = {
                    id: data?.id,
                    name: addressName,
                    country: country,
                    province: province,
                    city: city,
                    streetInfo: streetInfo,
                };

                setter((prev) => [...prev, newAddress]);

                toast.success('Address added successfully');
                closeModal();
                return;
            }

            const { data, error } = await supabase
                .from('addresses')
                .update({
                    name: addressName,
                    country: country,
                    province: province,
                    city: city,
                    street_info: streetInfo,
                })
                .eq('user_id', user?.id)
                .eq('id', currentAddress?.id)
                .single();

            if (error) throw error;

            const newAddress = {
                id: currentAddress?.id || data?.id,
                name: addressName,
                country: country,
                province: province,
                city: city,
                streetInfo: streetInfo,
            };

            setter((prev) =>
                prev?.map((address) =>
                    address.id === currentAddress.id ? newAddress : address
                )
            );

            toast.success('Address saved');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!user) throw new Error('User is not logged in');
            if (!currentAddress) throw new Error('Address is not selected');

            const { data, error } = await supabase
                .from('addresses')
                .delete()
                .eq('user_id', user?.id)
                .eq('id', currentAddress?.id)
                .single();

            if (error) throw error;

            setter((prev) =>
                prev?.filter((address) => address.id !== currentAddress.id)
            );

            toast.success('Address deleted');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <FormInput
                label="Name"
                id="item-name"
                placeholder="Enter item name"
                value={itemName}
                setter={setItemName}
            />
            <FormInput
                label="Description"
                id="item-description"
                placeholder="Enter item description"
                value={itemDescription}
                setter={setItemDescription}
            />
            <FormInput
                label="Price"
                id="item-price"
                placeholder="Enter item price"
                value={itemPrice}
                setter={setItemPrice}
            />

            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 mt-8">
                <button
                    className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {currentItem?.id != null && (
                    <button
                        className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                )}

                <button
                    className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={handleSubmit}
                >
                    {currentItem?.id == null ? 'Add Item' : 'Update'}
                </button>
            </div>
        </>
    );
}
