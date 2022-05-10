import { MinusIcon, PlusIcon } from '@heroicons/react/outline';

export default function AmountAdjuster({ amount, onDecrement, onIncrement }) {
    return (
        <div className="flex py-[1px] items-center rounded-full border bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
            <button
                onClick={onDecrement}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition duration-300"
            >
                <MinusIcon className="h-4 w-4 font-semibold" />
            </button>
            <div className="px-2 min-w-[2rem] text-center font-semibold">
                {amount}
            </div>
            <button
                onClick={onIncrement}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition duration-300"
            >
                <PlusIcon className="h-4 w-4 font-semibold" />
            </button>
        </div>
    );
}
