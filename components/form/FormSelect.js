import { ChevronDownIcon } from '@heroicons/react/outline';

import FormLabel from './FormLabel';

export default function FormSelect({
    id,
    label,
    value,
    options,
    noIcon,
    required,
    setter,
    className,
    ref,
    onClick,
    autoComplete,
    children,
}) {
    return (
        <FormLabel id={id} label={label} className={className}>
            <div className="group relative flex">
                {children && (
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 bg-white px-3 text-sm text-zinc-600 shadow-sm transition duration-300 group-hover:border-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800/70 dark:text-zinc-400">
                        {children}
                    </span>
                )}

                <select
                    id={id}
                    name={id}
                    value={value}
                    onClick={onClick}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    className={`${
                        children ? 'rounded-r-lg' : 'rounded-lg'
                    } w-full flex-1 appearance-none border border-zinc-300 bg-white py-2 px-4 text-zinc-700 placeholder-zinc-400 shadow-sm outline-none transition duration-300 group-hover:border-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800 dark:text-zinc-300`}
                    required={required}
                    onChange={(e) => {
                        setter && setter(e.target.value);
                    }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    ref={ref}
                </select>

                {noIcon || (
                    <ChevronDownIcon className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 transform text-zinc-400 dark:text-zinc-500" />
                )}
            </div>
        </FormLabel>
    );
}
