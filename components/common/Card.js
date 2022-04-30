export default function Card({ children, className, disableHoverEffect }) {
    const defaultCss = `bg-zinc-50 ${
        disableHoverEffect ||
        'hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
    } dark:bg-zinc-800/70 border dark:border-zinc-800 rounded-lg shadow transition duration-300`;

    return <div className={`${defaultCss} p-4 ${className}`}>{children}</div>;
}
