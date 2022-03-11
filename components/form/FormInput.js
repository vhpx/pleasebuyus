import FormLabel from './FormLabel';

export default function FormInput({
    id,
    type,
    label,
    value,
    placeholder,
    required,
    disabled,
    setter,
    className,
    children,
}) {
    return (
        <FormLabel id={id} label={label} className={className}>
            <div className="flex">
                {children && (
                    <span className="inline-flex items-center rounded-l-md border border-zinc-300 bg-white px-3 text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400">
                        {children}
                    </span>
                )}

                <input
                    type={type ?? 'text'}
                    id={id}
                    name={id}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${
                        children ? 'rounded-r-lg' : 'rounded-lg'
                    } w-full flex-1 appearance-none border border-zinc-300 bg-white py-2 px-4 text-zinc-700 placeholder-zinc-400 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300`}
                    onChange={(e) => {
                        setter && setter(e.target.value);
                    }}
                />
            </div>
        </FormLabel>
    );
}
