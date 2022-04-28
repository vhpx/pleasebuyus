import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OutlinedButton from '../components/buttons/OutlinedButton';
import Divider from '../components/common/Divider';
import Title from '../components/common/Title';
import FormInput from '../components/form/FormInput';
import FormSelect from '../components/form/FormSelect';
import { StoreLayout } from '../components/layout/layout';
import { RequireAuth, useUser } from '../hooks/useUser';

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

    const [updating, setUpdating] = useState(false);

    const [name, setName] = useState(userData?.name ?? '');
    const [email, setEmail] = useState(userData?.email ?? '');
    const [phoneNumber, setPhoneNumber] = useState(
        userData?.phone_number ?? ''
    );
    const [birthday, setBirthday] = useState(userData?.birthday ?? '');
    const [gender, setGender] = useState(userData?.gender ?? '');

    const handleUserDataFetch = useCallback(async () => {
        await fetchUserData();
        if (!userData) return;

        setName(userData?.name ?? '');
        setEmail(userData?.email ?? '');
        setPhoneNumber(userData?.phone_number ?? '');
        setBirthday(userData?.birthday ?? '');
        setGender(userData?.gender ?? '');
    }, [fetchUserData, userData]);

    useEffect(() => {
        handleUserDataFetch();
    }, [userData, handleUserDataFetch]);

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

            console.log('Updating user data...');
            console.log(userId, userEmail);

            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Phone number:', phoneNumber);
            console.log('Birthday:', birthday);
            console.log('Gender:', gender);

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

    return (
        <div className="p-4 md:p-8 lg:p-16">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8">
                <Title label="Profile" />
                <Divider />

                <div className="lg:w-2/3 mb-8 grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
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
                </div>

                <div className="flex justify-end">
                    <OutlinedButton
                        loading={updating}
                        label="Save profile"
                        loadingLabel="Saving"
                        onClick={updateProfile}
                    />
                </div>
            </div>
        </div>
    );
}
