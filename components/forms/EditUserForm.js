import { useState } from 'react';
import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';

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

export default function EditUserForm({ userData, closeModal, onCreate }) {
    const [name, setName] = useState(userData?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(
        userData?.phone_number || ''
    );
    const [birthday, setBirthday] = useState(userData?.birthday || '');
    const [gender, setGender] = useState(userData?.gender || '');

    return (
        <>
            <FormInput
                label="Name"
                id="name"
                placeholder="John Doe"
                value={name}
                setter={setName}
                required
                disabled={!userData}
            />

            <FormInput
                label="Email"
                id="email"
                value={userData?.email}
                placeholder="work@vohoangphuc.com"
                required
                disabled={true}
            />

            <FormInput
                label="Phone Number"
                id="phone-number"
                placeholder="+1 (555) 555-5555"
                value={phoneNumber}
                setter={setPhoneNumber}
                required
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

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setName(null);
                        setPhoneNumber(null);
                        setBirthday(null);
                        setGender(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() =>
                        onCreate({
                            id: userData?.id,
                            name: name || null,
                            phone_number: phoneNumber,
                            birthday: birthday || null,
                            gender: gender || null,
                        })
                    }
                >
                    Update
                </button>
            </div>
        </>
    );
}
