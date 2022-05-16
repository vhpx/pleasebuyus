import { useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';

export default function EditAddressForm({
    user,
    address: currentAddress,
    closeModal,
    setter,
    showUIDField,
}) {
    const [userId, setUserId] = useState(
        user?.id || currentAddress?.user_id || ''
    );
    const [addressName, setAddressName] = useState(currentAddress?.name || '');
    const [country, setCountry] = useState(currentAddress?.country || '');
    const [province, setProvince] = useState(currentAddress?.province || '');
    const [city, setCity] = useState(currentAddress?.city || '');
    const [streetInfo, setStreetInfo] = useState(
        currentAddress?.streetInfo || ''
    );

    const hasAddress = () =>
        addressName || country || province || city || streetInfo;

    const isUUID = (str) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            str
        );
    };

    const handleSubmit = async () => {
        try {
            if (!hasAddress()) throw new Error('Address is empty');
            if (!userId) throw new Error('User is not found');

            if (currentAddress?.id == null || !isUUID(currentAddress?.id)) {
                const { data, error } = await supabase
                    .from('addresses')
                    .insert({
                        user_id: userId,
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
                    user_id: userId,
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
                .eq('user_id', userId)
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
                user_id: userId,
            };

            setter((prev) =>
                prev?.map((address) =>
                    address?.id === currentAddress?.id
                        ? { ...address, ...newAddress }
                        : address
                )
            );

            toast.success('Address updated successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!userId) throw new Error('User is not found');
            if (!currentAddress) throw new Error('Address is not selected');

            const { data, error } = await supabase
                .from('addresses')
                .delete()
                .eq('user_id', userId)
                .eq('id', currentAddress?.id)
                .single();

            if (error) throw error;

            setter((prev) =>
                prev?.filter((address) => address.id !== currentAddress.id)
            );

            toast.success('Address deleted successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {showUIDField && (
                <>
                    {(currentAddress?.users?.name ||
                        currentAddress?.users?.email) && (
                        <FormInput
                            label={
                                currentAddress?.users?.name ? 'Name' : 'Email'
                            }
                            id={currentAddress?.users?.name ? 'name' : 'email'}
                            value={
                                currentAddress?.users?.name ||
                                currentAddress?.users?.email ||
                                ''
                            }
                            disabled={true}
                        />
                    )}
                    <FormInput
                        label="User ID"
                        id="user-id"
                        value={userId}
                        setter={setUserId}
                        disabled={!!currentAddress?.user_id}
                    />
                </>
            )}

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
