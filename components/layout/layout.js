import Footer from './footer';
import { BankHeader, StoreHeader } from './header';
import Sidebar from './sidebar/Sidebar';

export function StoreLayout({
    label,
    hideHeader,
    hideFooter,
    darkMode,
    children,
}) {
    return (
        <div className="min-h-screen">
            {hideHeader || (
                <StoreHeader
                    darkMode={darkMode}
                    label={label}
                    whiteMode={false}
                />
            )}
            <main
                className={`${
                    hideFooter || 'min-h-screen'
                } w-full bg-zinc-100 text-black scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 dark:bg-[#111113] dark:text-white dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800`}
            >
                {children}
            </main>
            {hideFooter || <Footer darkMode={darkMode} />}
        </div>
    );
}

export function BankLayout({
    label,
    hideHeader,
    hideFooter,
    darkMode,
    children,
}) {
    return (
        <div className="min-h-screen">
            {hideHeader || <BankHeader darkMode={darkMode} label={label} />}
            <main
                className={`${
                    hideFooter || 'min-h-screen'
                } w-full bg-zinc-100 text-black scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 dark:bg-[#111113] dark:text-white dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800`}
            >
                {children}
            </main>
            {hideFooter || <Footer darkMode={darkMode} />}
        </div>
    );
}

export function SidebarLayout({
    label,
    hideSidebar,
    hideNavBar,
    children,
    className,
    sidebarClassName,
    darkMode,
}) {
    const collapsed = false;

    const contentCss = `${className} ${collapsed ? 'md:ml-16' : 'md:ml-64'}`;
    const sidebarCss = `${sidebarClassName} ${
        collapsed ? 'md:w-16' : 'md:w-64'
    }`;

    return (
        <div className="flex w-full h-screen">
            {hideSidebar || <Sidebar className={sidebarCss} />}
            <main
                className={`${contentCss} w-full flex flex-col bg-zinc-100 text-black scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 dark:bg-[#111113] dark:text-white dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800`}
            >
                {hideNavBar || (
                    <StoreHeader
                        darkMode={darkMode}
                        label={label}
                        hideLogo
                        hideWishlist
                        hideCart
                        whiteMode
                        dashboardMode
                    />
                )}
                {children}
            </main>
        </div>
    );
}
