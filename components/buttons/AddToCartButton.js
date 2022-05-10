export default function AddToCartButton({ onClick, className }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full border-2 border-zinc-500/70 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-white/10 text-zinc-700/70 dark:text-zinc-300 dark:hover:text-white hover:text-white font-semibold px-4 py-1 transition duration-300 ${className}`}
        >
            Add to cart
        </button>
    );
}
