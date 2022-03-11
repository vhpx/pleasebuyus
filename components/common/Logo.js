import Image from 'next/image';
import BetterLink from '../link/BetterLink';

export default function Logo() {
    return (
        <BetterLink href={'/'}>
            <Image
                src="/images/logo.png"
                alt="Please buy us logo"
                width={100}
                height={60}
            />
        </BetterLink>
    );
}
