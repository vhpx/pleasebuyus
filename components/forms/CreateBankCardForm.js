import { useState } from 'react';
import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';

export default function CreateBankCardForm({
    banks,

    holderName,
    closeModal,
    onCreate,
}) {
    const [bank, setBank] = useState(null);

    const bankOptions = banks
        ? [
              {
                  value: null,
                  label: 'Select a bank',
              },
              ...banks.map((bank) => ({
                  value: bank.code,
                  label: bank.short_name,
              })),
          ]
        : [];

    return (
        <>
            <FormInput
                label="Card Holder Name"
                id="name"
                value={holderName}
                disabled={true}
                required
            />

            <FormSelect
                label="Bank Name"
                id="bank-name"
                placeholder="Enter outlet address"
                options={bankOptions}
                setter={(value) => (value ? setBank(value) : setBank(null))}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setBank(null);
                        closeModal();
                    }}
                >
                    Cancel
                </button>

                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => onCreate(bank)}
                >
                    Open Card
                </button>
            </div>
        </>
    );
}
