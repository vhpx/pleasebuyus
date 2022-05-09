import Image from 'next/image';
import DefaultAvatar from './DefaultAvatar';

export default function Avatar({ size = 40, url, hideDefault, alt }) {
    const defaultCss = 'rounded-lg';

    return (
        <>
            {url ? (
                <Image
                    src={url}
                    alt={alt ?? 'Avatar'}
                    width={size}
                    height={size}
                    className={defaultCss}
                />
            ) : hideDefault ? (
                <div className="h-32 w-32 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-lg" />
            ) : (
                <DefaultAvatar size={size} />
            )}
        </>
    );
}
