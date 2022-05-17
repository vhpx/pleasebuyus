import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';

export default function CreateUserCardForm({
    user,
    userData,
    closeModal,
    setter,
}) {
    const [cardHolderName, setCardHolderName] = useState(
        userData?.name || userData?.email || ''
    );
    const [bankCode, setBankCode] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardPIN, setCardPIN] = useState('');

    const [loadingBanks, setLoadingBanks] = useState(true);
    const [bankOptions, setBankOptions] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const { data, error } = await supabase
                    .from('banks')
                    .select('*');

                if (error) throw error;

                const options = data.map((bank) => ({
                    value: bank.code,
                    label:
                        bank.short_name == bank.code
                            ? bank.code
                            : `${bank.short_name} (${bank.code})`,
                }));

                setBankOptions(options);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingBanks(false);
            }
        };

        fetchBanks();
    }, [userData]);

    const formatCardNumber = (cardNumber) => {
        return cardNumber
            ?.replace(/\D/g, '')
            ?.replace(/(.{4})/g, '$1 ')
            ?.trim();
    };

    const handleSubmit = async () => {
        if (!cardHolderName) {
            toast.error('Please enter a card holder name');
            return;
        }

        if (!bankCode) {
            toast.error('Please select a bank');
            return;
        }

        if (!cardNumber) {
            toast.error('Please enter a card number');
            return;
        }

        if (!cardPIN) {
            toast.error('Please enter a card PIN');
            return;
        }

        const cardData = {
            user_id: user.id,
            bank_code: bankCode,
            card_number: cardNumber.replace(/\s/g, ''),
        };

        try {
            const { data: bankCardData, error: bankCardError } = await supabase
                .from('bank_cards')
                .select('users (name, email)')
                .eq('card_number', cardNumber.replace(/\s/g, ''))
                .eq('bank_code', bankCode)
                .eq('PIN', cardPIN)
                .single();

            if (bankCardError) throw new Error("The card couldn't be found.");

            if (
                bankCardData.users.name !== cardHolderName &&
                bankCardData.users.email !== cardHolderName
            )
                throw new Error('Card holder name do not match');

            const { data, error } = await supabase
                .from('saved_cards')
                .insert(cardData)
                .maybeSingle();

            if (error) throw error;

            setter((prev) => [...prev, data]);

            toast.success('Card added successfully');
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <FormInput
                label="Card Holder Name"
                id="card-holder-name"
                value={cardHolderName}
                setter={setCardHolderName}
            />
            <FormSelect
                label="Bank"
                id="bank-code"
                placeholder="000"
                options={
                    loadingBanks
                        ? [{ value: '', label: 'Loading...' }]
                        : [
                              { value: '', label: 'Select a bank' },
                              ...bankOptions,
                          ]
                }
                value={bankCode}
                setter={setBankCode}
            />
            <FormInput
                label="Card Number"
                id="card-number"
                placeholder="0000 0000 0000 0000"
                value={formatCardNumber(cardNumber)}
                setter={setCardNumber}
            />
            <FormInput
                label="Card PIN"
                id="card-pin"
                placeholder="0000"
                value={cardPIN}
                setter={setCardPIN}
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

                <button
                    className="flex items-center justify-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={handleSubmit}
                >
                    Add Card
                </button>
            </div>
        </>
    );
}
