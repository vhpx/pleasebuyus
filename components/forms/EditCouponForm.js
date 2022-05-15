import { useEffect, useState } from 'react';
import FormInput from '../form/FormInput';
import FormSelect from '../form/FormSelect';

export default function EditCouponForm({
    coupon,
    closeModal,
    onCreate,
    onDelete,
}) {
    const [code, setCode] = useState(coupon?.code || '');
    const [couponName, setCouponName] = useState(coupon?.name || '');
    const [value, setValue] = useState(coupon?.value || '');
    const [useRatio, setUseRatio] = useState(coupon?.use_ratio || false);

    return (
        <>
            <FormInput
                label="Coupon code"
                id="coupon-code"
                value={code}
                setter={setCode}
                required
            />

            <FormInput
                label="Coupon name"
                id="coupon-name"
                value={couponName}
                setter={setCouponName}
                required
            />

            <FormInput
                label="Coupon value"
                id="coupon-value"
                value={value}
                setter={setValue}
                required
            />

            <FormSelect
                label="Coupon type"
                id="coupon-type"
                value={useRatio}
                setter={setUseRatio}
                options={[
                    { label: 'Discount by value', value: false },
                    { label: 'Discount by percentage', value: true },
                ]}
                required
            />

            <div className="flex justify-end space-x-2 mt-8">
                <button
                    className="flex items-center font-semibold space-x-2 px-4 py-1 bg-zinc-100 hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300"
                    onClick={() => {
                        setCode(null);
                        setCouponName(null);
                        setValue(null);
                        setUseRatio(null);

                        closeModal();
                    }}
                >
                    Cancel
                </button>

                {coupon && coupon?.id && (
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
                            id: coupon?.id,
                            code,
                            name: couponName,
                            value,
                            use_ratio: useRatio === true || useRatio === 'true',
                        })
                    }
                >
                    Add
                </button>
            </div>
        </>
    );
}
