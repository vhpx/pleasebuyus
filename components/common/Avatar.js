import Image from 'next/image';
import { useUser } from '../../hooks/useUser';
import DefaultAvatar from './DefaultAvatar';

export default function Avatar({ size = 40, url, hideDefault, alt }) {
    const defaultCss = 'rounded-lg';

    const { userData } = useUser();

    const avatarUrl = url ?? (hideDefault ? '' : userData?.['avatar_url']);
    const displayName = url
        ? alt
        : userData?.['display_name'] ?? 'Profile avatar';

    return (
        <>
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={displayName}
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
