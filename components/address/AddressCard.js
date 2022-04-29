import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase-client';
import Card from '../common/Card';
import Divider from '../common/Divider';
import LoadingIndicator from '../common/LoadingIndicator';
import FormInput from '../form/FormInput';

export default function AddressCard({ address: currentAddress, setter }) {
    const { user } = useUser();

    const { name, country, province, city, streetInfo } = currentAddress;

    const hasAddress = () =>
        nameValue ||
        countryValue ||
        provinceValue ||
        cityValue ||
        streetInfoValue;

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [nameValue, setNameValue] = useState(name);
    const [countryValue, setCountryValue] = useState(country);
    const [provinceValue, setProvinceValue] = useState(province);
    const [cityValue, setCityValue] = useState(city);
    const [streetInfoValue, setStreetInfoValue] = useState(streetInfo);

    const isUUID = (str) => {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            str
        );
    };

    const sameAddress = () => {
        return (
            currentAddress.name === nameValue &&
            currentAddress.country === countryValue &&
            currentAddress.province === provinceValue &&
            currentAddress.city === cityValue &&
            currentAddress.streetInfo === streetInfoValue
        );
    };

    const handleSubmit = async () => {
        if (sameAddress()) {
            setIsEditing(false);
            return;
        }

        setSaving(true);

        try {
            if (!hasAddress()) throw new Error('Address is empty');
            if (!user) throw new Error('User is not logged in');

            if (!isUUID(currentAddress.id)) {
                const { data, error } = await supabase
                    .from('addresses')
                    .insert({
                        user_id: user?.id,
                        name: nameValue,
                        country: countryValue,
                        province: provinceValue,
                        city: cityValue,
                        street_info: streetInfoValue,
                    })
                    .single();

                if (error) throw error;

                const newAddress = {
                    id: data?.id,
                    name: nameValue,
                    country: countryValue,
                    province: provinceValue,
                    city: cityValue,
                    streetInfo: streetInfoValue,
                };

                setter((prev) =>
                    prev.map((address) =>
                        address.id === currentAddress.id ? newAddress : address
                    )
                );

                setIsEditing(false);

                toast.success('Address saved');
                return;
            }

            const { data, error } = await supabase
                .from('addresses')
                .update({
                    name: nameValue,
                    country: countryValue,
                    province: provinceValue,
                    city: cityValue,
                    street_info: streetInfoValue,
                })
                .eq('user_id', user?.id)
                .eq('id', currentAddress?.id)
                .single();

            if (error) throw error;

            const newAddress = {
                id: currentAddress.id,
                name: nameValue,
                country: countryValue,
                province: provinceValue,
                city: cityValue,
                streetInfo: streetInfoValue,
            };

            setter((prev) =>
                prev?.map((address) =>
                    address.id === currentAddress.id ? newAddress : address
                )
            );

            setIsEditing(false);

            toast.success('Address saved');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);

        if (!isUUID(currentAddress.id)) {
            setter((prev) =>
                prev.filter((address) => address.id !== currentAddress.id)
            );
            setDeleting(false);

            toast.success('Address deleted');
            return;
        }

        try {
            if (!user) throw new Error('User is not logged in');

            const { data, error } = await supabase
                .from('addresses')
                .delete()
                .eq('user_id', user?.id)
                .eq('id', currentAddress?.id)
                .single();

            if (error) throw error;

            setter((prev) =>
                prev.filter((address) => address.id !== currentAddress.id)
            );

            setIsEditing(false);

            toast.success('Address deleted');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Card className="w-full min-h-[8rem] flex flex-col justify-between p-4 border dark:border-zinc-700/70 rounded-lg">
            {isEditing ? (
                <>
                    <FormInput
                        label="Address Name"
                        id="address-name"
                        placeholder="e.g. Home, Office"
                        value={nameValue}
                        setter={setNameValue}
                    />
                    <FormInput
                        label="Country"
                        id="country"
                        placeholder="e.g. Vietnam"
                        value={countryValue}
                        setter={setCountryValue}
                    />
                    <FormInput
                        label="Province (optional)"
                        id="province"
                        placeholder="e.g. Ho Chi Minh"
                        value={provinceValue}
                        setter={setProvinceValue}
                    />
                    <FormInput
                        label="City"
                        id="city"
                        placeholder="e.g. Ho Chi Minh"
                        value={cityValue}
                        setter={setCityValue}
                    />
                    <FormInput
                        label="Street Info"
                        id="street-info"
                        placeholder="e.g. Street 1, Building A"
                        value={streetInfoValue}
                        setter={setStreetInfoValue}
                    />

                    <button
                        className="mt-2 w-full px-4 py-2 bg-white dark:bg-zinc-800 text-sm md:text-base font-semibold inline-flex justify-center items-center space-x-2 text-center border dark:border-zinc-700 dark:hover:border-zinc-500 hover:border-zinc-500 hover:shadow rounded-lg transition duration-300"
                        onClick={handleSubmit}
                    >
                        {saving && <LoadingIndicator />}
                        <div>
                            {saving
                                ? isUUID(currentAddress?.id)
                                    ? 'Updating address'
                                    : 'Adding address'
                                : isUUID(currentAddress?.id)
                                ? 'Update address'
                                : 'Add Address'}
                        </div>
                    </button>
                </>
            ) : (
                <>
                    {hasAddress() ? (
                        <div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                            <Divider />

                            <p>{country}</p>
                            <p>{province}</p>
                            <p>{city}</p>
                            <p>{streetInfo}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h3 className="font-semibold">No address</h3>
                            <p className="text-zinc-500 dark:text-zinc-300">
                                Please add an address
                            </p>
                        </div>
                    )}

                    <Divider padding="mt-4 mb-2" />

                    <div className="flex space-x-2">
                        <button
                            className="mt-2 w-full px-4 py-2 bg-white dark:bg-zinc-800 text-sm md:text-base font-semibold inline-flex justify-center items-center space-x-2 text-center border dark:border-zinc-700 dark:hover:border-zinc-500 hover:border-zinc-500 hover:shadow rounded-lg transition duration-300"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>

                        <button
                            className="mt-2 w-full px-4 py-2 bg-white dark:bg-zinc-800 text-sm md:text-base font-semibold inline-flex justify-center items-center space-x-2 text-center border dark:border-zinc-700 dark:hover:border-zinc-500 hover:border-zinc-500 hover:shadow rounded-lg transition duration-300"
                            onClick={handleDelete}
                        >
                            {deleting && <LoadingIndicator />}
                            <div>{deleting ? 'Deleting' : 'Delete'}</div>
                        </button>
                    </div>
                </>
            )}
        </Card>
    );
}
