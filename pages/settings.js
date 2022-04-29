import { BadgeCheckIcon, PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddressCard from '../components/address/AddressCard';
import Button from '../components/buttons/Button';
import OutlinedButton from '../components/buttons/OutlinedButton';
import Avatar from '../components/common/Avatar';
import Divider from '../components/common/Divider';
import LoadingIndicator from '../components/common/LoadingIndicator';
import Title from '../components/common/Title';
import FormInput from '../components/form/FormInput';
import FormLabel from '../components/form/FormLabel';
import FormSelect from '../components/form/FormSelect';
import { StoreLayout } from '../components/layout/layout';
import { useTheme } from '../hooks/useTheme';
import { RequireAuth, useUser } from '../hooks/useUser';
import { supabase } from '../utils/supabase-client';

SettingsPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

const genderOptions = [
    { value: '', label: '-' },
    {
        value: 'male',
        label: 'Male',
    },
    {
        value: 'female',
        label: 'Female',
    },
    {
        value: 'other',
        label: 'Other',
    },
];

export default function SettingsPage() {
    RequireAuth();

    const { user, userData, fetchUserData, updateUserData } = useUser();
    const { darkMode, updateTheme } = useTheme();

    const [loadingAddress, setLoadingAddress] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState(userData?.name ?? '');
    const [email, setEmail] = useState(userData?.email ?? '');
    const [phoneNumber, setPhoneNumber] = useState(
        userData?.phone_number ?? ''
    );
    const [birthday, setBirthday] = useState(userData?.birthday ?? '');
    const [gender, setGender] = useState(userData?.gender ?? '');
    const [addresses, setAddresses] = useState([]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleUserDataFetch = useCallback(async () => {
        if (!userData) {
            await fetchUserData();
            return;
        }

        setName(userData?.name ?? '');
        setEmail(userData?.email ?? '');
        setPhoneNumber(userData?.phone_number ?? '');
        setBirthday(userData?.birthday ?? '');
        setGender(userData?.gender ?? '');
    }, [fetchUserData, userData]);

    useEffect(() => {
        handleUserDataFetch();
    }, [userData, handleUserDataFetch]);

    const validateAddress = (address) => {
        return (
            address?.name ||
            address?.country ||
            address?.province ||
            address?.city ||
            address?.streetInfo
        );
    };

    const updateProfile = async () => {
        if (!user || !userData) {
            toast.info('Please wait while we load your data.');
            return;
        }

        setUpdating(true);

        try {
            const userId = user?.id;
            const userEmail = user?.email;

            if (!userId) throw 'User ID not found.';
            if (!userEmail) throw 'User email is required.';

            const validAddresses = addresses.filter(validateAddress);
            console.log(validAddresses);

            const response = await fetch(`/api/users/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phoneNumber,
                    birthday,
                    gender,
                }),
            });

            if (!response.ok) throw error;

            updateUserData({ name, phoneNumber, birthday, gender });
            toast.success('Your profile has been updated.');
        } catch (e) {
            toast.error(e ?? e?.message ?? 'An error has occurred.');
        } finally {
            setUpdating(false);
        }
    };

    const downloadImage = (path) => {
        try {
            const { publicURL, error } = supabase.storage
                .from('avatars')
                .getPublicUrl(path);

            if (error) {
                throw error;
            }

            return publicURL;
        } catch (error) {
            console.log('Error downloading image: ', error.message);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const avatarUrl = downloadImage(filePath);

            const { error } = await supabase
                .from('users')
                .update({ avatar_url: avatarUrl }, { returning: 'minimal' })
                .eq('id', user?.id);

            if (error) throw error;

            await updateUserData({ avatarUrl });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const setLightMode = () => {
        if (!darkMode) return;
        localStorage.setItem('pbu-dark-mode', 'false');
        updateTheme(false);
    };

    const setDarkMode = () => {
        if (darkMode) return;
        localStorage.setItem('pbu-dark-mode', 'true');
        updateTheme(true);
    };

    const addAddress = () => {
        setAddresses((prevAddresses) => [
            ...prevAddresses,
            {
                id: Math.random().toString(),
                name: '',
                country: '',
                province: '',
                city: '',
                streetInfo: '',
            },
        ]);
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            setLoadingAddress(true);

            try {
                const { data } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user?.id);

                const addresses = data?.map((address) => {
                    return {
                        id: address.id,
                        name: address.name,
                        country: address.country,
                        province: address.province,
                        city: address.city,
                        streetInfo: address.street_info,
                    };
                });

                setAddresses(addresses);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchAddresses();
    }, [user]);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Profile" />
                <Divider />

                <div className="lg:w-2/3 mb-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                    <div className="flex flex-col md:flex-row col-span-full mb-8 items-center justify-start space-y-4 md:space-x-8 md:space-y-0">
                        <Avatar size={140} />

                        <div className="flex flex-col w-full">
                            <FormLabel
                                className="mb-0"
                                id="avatar"
                                label={
                                    uploading
                                        ? 'Uploading...'
                                        : 'Upload a profile picture'
                                }
                            />

                            <input
                                className="block max-w-md cursor-pointer rounded-lg border border-zinc-300 bg-white transition duration-300 placeholder:text-black hover:border-zinc-400 hover:bg-zinc-200/50 focus:border-transparent focus:outline-none dark:border-zinc-700/50 dark:bg-zinc-900/70 dark:text-white dark:placeholder:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                aria-describedby="user_avatar_help"
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                            />
                            <div
                                className="mt-1 text-sm text-zinc-500 dark:text-zinc-300"
                                id="avatar-description"
                            >
                                Your avatar is a way for people to recognize
                                you.
                            </div>
                        </div>
                    </div>
                    <Divider className="col-span-full" />

                    <FormInput
                        id="name"
                        label="Name"
                        value={name}
                        setter={setName}
                        disabled={!userData}
                    />
                    <FormInput
                        id="email"
                        label="Email"
                        value={email}
                        disabled={true}
                    />
                    <FormInput
                        id="phone"
                        label="Phone number"
                        value={phoneNumber}
                        setter={setPhoneNumber}
                        disabled={!userData}
                    />
                    <FormInput
                        type="date"
                        id="birthday"
                        label="Birthday"
                        value={birthday}
                        setter={setBirthday}
                        disabled={!userData}
                    />
                    <FormSelect
                        id="gender"
                        label="Gender"
                        value={gender}
                        setter={setGender}
                        options={genderOptions}
                        disabled={!userData}
                    />
                    <Divider className="mt-8 col-span-full" />

                    <div className="col-span-full">
                        <div className="flex items-center space-x-2">
                            <div className="font-semibold">Address</div>
                            {loadingAddress || (
                                <button
                                    className="p-2 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                                    onClick={addAddress}
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {loadingAddress ? (
                            <div className="mt-6">
                                <LoadingIndicator svgClassName="h-8 w-8" />
                            </div>
                        ) : (
                            <div className="text-left">
                                {!addresses && addresses.length > 0 ? (
                                    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses?.map((address) => (
                                            <AddressCard
                                                key={address.id}
                                                address={address}
                                                setter={setAddresses}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mt-2 mb-4 text-sm text-zinc-500 dark:text-zinc-300">
                                            You have no addresses.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <Divider className="mt-8 col-span-full" />
                </div>

                <OutlinedButton
                    loading={updating}
                    label="Save profile"
                    loadingLabel="Saving"
                    className="max-w-sm"
                    onClick={updateProfile}
                />
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Account" />
                <Divider />

                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <OutlinedButton
                        label="Change password"
                        href="/reset-password"
                    />

                    <OutlinedButton label="Log out" onClick={handleLogout} />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-8">
                <Title label="Theme" />
                <Divider />

                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <button
                        onClick={setLightMode}
                        className="group flex flex-1 justify-between rounded-lg border-2 border-blue-600 p-4 shadow transition duration-300 dark:border-zinc-600 dark:hover:border-white dark:hover:bg-zinc-800"
                    >
                        <div className="dark:group-hover:text-white">
                            Light mode
                        </div>
                        {darkMode || (
                            <div className="flex items-center space-x-1 text-sm font-bold text-blue-600 dark:text-white dark:group-hover:text-white">
                                <div>Selected</div>
                                <BadgeCheckIcon className="h-6 w-6" />
                            </div>
                        )}
                    </button>

                    <button
                        onClick={setDarkMode}
                        className="group flex flex-1 justify-between rounded-lg border-2 p-4 transition duration-300 hover:border-black dark:border-zinc-300 dark:bg-zinc-700"
                    >
                        <div className="group-hover:text-black dark:text-zinc-200 dark:group-hover:text-zinc-200">
                            Dark mode
                        </div>
                        {darkMode && (
                            <div className="flex items-center space-x-1 text-sm font-bold text-blue-600 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-zinc-200">
                                <div>Selected</div>
                                <BadgeCheckIcon className="h-6 w-6" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
