import { StoreNavBar } from './navbar';

export function StoreHeader({ label }) {
    return (
        <header className="sticky top-0 z-40">
            <StoreNavBar label={label} />
        </header>
    );
}
