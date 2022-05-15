import { useState } from 'react';
import FormInput from '../form/FormInput';

export default function EditCardForm({ card, closeModal, onCreate, onDelete }) {
    const [ownerId, setOwnerId] = useState(card?.owner_id || '');
    const [bankCode, setBankCode] = useState(card?.bank_code || '');
    const [cardNumber, setCardNumber] = useState(card?.card_number || '');
    const [cardPIN, setCardPIN] = useState(card?.PIN || '');

    return (
        <>
            <FormInput
                label="Owner ID"
                id="owner-id"
                value={ownerId}
                setter={setOwnerId}
                required
            />

            <FormInput
                label="Bank code"
                id="bank-code"
                value={bankCode}
                setter={setBankCode}
                required
            />

            <FormInput
                label="Card number"
                id="card-number"
                value={cardNumber}
                setter={setCardNumber}
                required
            />

            <FormInput
                label="Card PIN"
                id="card-PIN"
                value={cardPIN}
                setter={setCardPIN}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setOwnerId(null);
                        setBankCode(null);
                        setCardNumber(null);
                        setCardPIN(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {onDelete && card && card?.card_number && (
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
                            owner_id: ownerId,
                            bank_code: bankCode,
                            card_number: cardNumber,
                            PIN: cardPIN,
                        })
                    }
                >
                    {onDelete && card && card?.card_number
                        ? 'Update'
                        : 'Create'}
                </button>
            </div>
        </>
    );
}
