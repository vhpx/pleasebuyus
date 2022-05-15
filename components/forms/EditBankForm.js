import { useState } from 'react';
import FormInput from '../form/FormInput';

export default function EditBankForm({ bank, closeModal, onCreate, onDelete }) {
    const [code, setCode] = useState(bank?.code || '');
    const [bankName, setbankName] = useState(bank?.name || '');
    const [shortName, setShortName] = useState(bank?.short_name || '');

    return (
        <>
            <FormInput
                label="Bank code"
                id="bank-code"
                value={code}
                setter={(e) => setCode(e.toUpperCase())}
                required
            />

            <FormInput
                label="Bank name"
                id="bank-name"
                value={bankName}
                setter={setbankName}
                required
            />

            <FormInput
                label="Bank short name"
                id="bank-short-name"
                value={shortName}
                setter={setShortName}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setCode(null);
                        setbankName(null);
                        setShortName(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {onDelete && bank && bank?.code && (
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
                            id: bank?.id,
                            code,
                            name: bankName,
                            short_name: shortName,
                        })
                    }
                >
                    {onDelete && bank && bank?.code ? 'Update' : 'Create'}
                </button>
            </div>
        </>
    );
}
