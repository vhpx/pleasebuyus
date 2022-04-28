export default function Button({
    loading,
    label,
    loadingLabel,
    type,
    onClick,
    className,
    labelClassName,
    children,
}) {
    return (
        <button type={type} className={className} onClick={onClick}>
            <div className={labelClassName}>
                {loading ? loadingLabel : label ?? children}
            </div>
        </button>
    );
}
