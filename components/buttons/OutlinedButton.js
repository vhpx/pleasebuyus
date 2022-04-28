import LoadingIndicator from '../common/LoadingIndicator';
import BetterLink from '../link/BetterLink';

export default function OutlinedButton({
    label,
    href,
    loadingLabel,
    type,
    widthConstraint,
    loading,
    onClick,
    className,
    children,
    leadingIcon,
    trailingIcon,
}) {
    const defaultProperties =
        'px-4 py-2 bg-white dark:bg-zinc-800 text-sm md:text-base font-semibold inline-flex justify-center items-center space-x-2 text-center border dark:border-zinc-700 dark:hover:border-zinc-500 hover:border-zinc-500 hover:shadow rounded-lg transition duration-300';

    const css = `${defaultProperties} ${
        widthConstraint || 'w-full md:min-w-[10rem]'
    } ${className} ${loading && 'cursor-not-allowed'}`;

    return (
        <BetterLink href={href}>
            <button type={type} className={css} onClick={onClick}>
                {leadingIcon}
                {loading && <LoadingIndicator />}
                <div>{loading ? loadingLabel : label ?? children}</div>
                {trailingIcon}
            </button>
        </BetterLink>
    );
}
