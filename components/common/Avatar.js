import Image from 'next/image';
import { useUser } from '../../hooks/useUser';
import DefaultAvatar from './DefaultAvatar';

export default function Avatar({ size = 40, url }) {
    const defaultCss = 'rounded-lg';

    const { userData } = useUser();

    const avatarUrl = url ?? userData?.['avatar_url'];
    const displayName = userData?.['display_name'] ?? 'Profile avatar';

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
            ) : (
                <DefaultAvatar size={size} />
            )}
        </>
    );
}
