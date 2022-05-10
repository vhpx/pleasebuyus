export default function Title({ label, className, children }) {
    return (
        <div className={`font-bold text-2xl ${className}`}>
            {label ?? children}
        </div>
    );
}
