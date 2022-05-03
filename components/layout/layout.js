import Footer from './footer';
import { BankHeader, StoreHeader } from './header';

export function StoreLayout({
    label,
    hideHeader,
    hideFooter,
    darkMode,
    children,
}) {
    return (
        <>
            {hideHeader || <StoreHeader darkMode={darkMode} label={label} />}
            <main className="min-h-screen w-full bg-zinc-100 text-black scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 dark:bg-[#111113] dark:text-white dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800">
                {children}
            </main>
            {hideFooter || <Footer darkMode={darkMode} />}
        </>
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
        <>
            {hideHeader || <BankHeader darkMode={darkMode} label={label} />}
            <main className="min-h-screen w-full bg-zinc-100 text-black scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 dark:bg-[#111113] dark:text-white dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-800">
                {children}
            </main>
            {hideFooter || <Footer darkMode={darkMode} />}
        </>
    );
}
