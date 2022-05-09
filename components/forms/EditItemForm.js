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
                label="Address Name"
                id="address-name"
                placeholder="e.g. Home, Office"
                value={addressName}
                setter={setAddressName}
            />
            <FormInput
                label="Country"
                id="country"
                placeholder="e.g. Vietnam"
                value={country}
                setter={setCountry}
            />
            <FormInput
                label="Province"
                id="province"
                placeholder="Optional"
                value={province}
                setter={setProvince}
            />
            <FormInput
                label="City"
                id="city"
                placeholder="e.g. Ho Chi Minh"
                value={city}
                setter={setCity}
            />
            <FormInput
                label="Street Info"
                id="street-info"
                placeholder="e.g. Street 1, Building A"
                value={streetInfo}
                setter={setStreetInfo}
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

                {currentAddress?.id != null && isUUID(currentAddress?.id) && (
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
                    {currentAddress?.id == null || !isUUID(currentAddress?.id)
                        ? 'Add Address'
                        : 'Update'}
                </button>
            </div>
        </>
    );
}
