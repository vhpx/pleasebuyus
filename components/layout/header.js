import { BankNavBar, StoreNavBar } from './navbar';

export function StoreHeader({
    label,
    hideLogo,
    hideWishlist,
    hideCart,
    whiteMode,
    dashboardMode,
}) {
    return (
        <header className="sticky top-0 z-40">
            <StoreNavBar
                label={label}
                hideLogo={hideLogo}
                hideWishlist={hideWishlist}
                hideCart={hideCart}
                whiteMode={whiteMode}
                dashboardMode={dashboardMode}
            />
        </header>
    );
}

export function BankHeader({ label }) {
    return (
        <header className="sticky top-0 z-40">
            <BankNavBar label={label} />
        </header>
    );
}
