export default function FormLabel({ id, label, className, children }) {
    return (
        <div
            className={`mb-2 flex flex-col focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-700 ${className}`}
        >
            <label
                className={`mb-1 font-semibold ${label || 'hidden'}`}
                htmlFor={id}
            >
                {label}
            </label>
            {children}
        </div>
    );
}
