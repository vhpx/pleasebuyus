export default function Divider({ className }) {
    return (
        <div
            className={`mt-2 mb-8 h-[1px] w-full bg-zinc-300 dark:bg-zinc-700/70 ${className}`}
        />
    );
}
