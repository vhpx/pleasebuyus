export default function Container({ children, className }) {
    const defaultCss = 'max-w-full max-h-full p-8';

    return <div className={`${defaultCss} ${className}`}>{children}</div>;
}
