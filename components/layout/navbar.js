import {
    LoginIcon,
    MenuIcon,
    SearchIcon,
    XIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import Avatar from '../common/Avatar';
import Logo, { BankLogo } from '../common/Logo';
import CartDropdown from '../dropdown/CartDropdown';
import UserDropdown from '../dropdown/UserDropdown';
import WishlistDropdown from '../dropdown/WishlistDropdown';
import BetterLink from '../link/BetterLink';

export function StoreNavBar() {
    const [scrolled, setScrolled] = useState(0);
    const [menuClosed, setMenuClosed] = useState(true);

    const handleScroll = () => setScrolled(window.scrollY);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const router = useRouter();

    const { user, userData } = useUser();
    const { darkMode, updateTheme } = useTheme();

    const openMenu = () => setMenuClosed(false);
    const closeMenu = () => setMenuClosed(true);

    const displayName = userData?.['name'];

    const navigateTo = (path) => {
        closeMenu();
        router.push(path);
    };

    return (
        <nav
            className={`flex items-center justify-between border-b bg-blue-500 px-4 py-2 shadow dark:border-transparent dark:bg-zinc-900 dark:text-white md:px-12 ${
                scrolled || 'border-transparent shadow-none'
            }`}
        >
            {menuClosed || (
                <div className="fixed flex flex-col justify-between inset-0 z-50 bg-white/70 backdrop-blur-lg dark:bg-zinc-900/70 md:hidden md:bg-white md:dark:bg-zinc-900">
                    <div className="relative flex items-center justify-center px-2.5 py-4">
                        <Logo />
                        <button
                            className="absolute right-4 rounded-full p-2 md:hidden"
                            onClick={closeMenu}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-col px-8 py-4 space-y-2 text-center">
                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/')}
                        >
                            Browse items
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/outlets')}
                        >
                            Outlets
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/membership')}
                        >
                            Membership
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/history')}
                        >
                            Purchase History
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/banks')}
                        >
                            Banks
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/settings')}
                        >
                            Settings
                        </BetterLink>
                    </div>

                    {user ? (
                        <div className="relative flex items-center justify-center px-2.5 py-4">
                            <Avatar size={30} />
                            {displayName && (
                                <div className="ml-2 text-sm font-semibold md:block">
                                    {displayName}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="m-4 flex flex-col space-y-2">
                            <BetterLink href="/signup">
                                <div className="flex items-center text-white border-transparent justify-center space-x-2 rounded-lg border px-4 py-2 transition duration-150 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100">
                                    <div className="font-semibold">Sign up</div>
                                </div>
                            </BetterLink>
                            <BetterLink href="/login">
                                <div className="flex items-center text-white border-transparent justify-center space-x-2 rounded-lg border px-4 py-2 transition duration-150 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100">
                                    <div className="font-semibold">Login</div>
                                </div>
                            </BetterLink>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center space-x-2">
                {menuClosed && (
                    <button className="p-2" onClick={openMenu}>
                        <MenuIcon className="h-6 w-6 text-white md:hidden" />
                    </button>
                )}
                <Logo />
            </div>

            <div className="hidden w-1/2 md:flex">
                <span className="inline-flex items-center rounded-l-md border border-zinc-300 bg-white px-3 text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400">
                    <SearchIcon className="h-5 w-5" />
                </span>

                <input
                    id="search-input"
                    name="search"
                    placeholder="Search everything here"
                    className={`w-full flex-1 appearance-none rounded-r-lg border border-zinc-300 bg-white py-2 px-4 text-zinc-700 placeholder-zinc-400 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300`}
                    onChange={(e) => {
                        setter && setter(e.target.value);
                    }}
                />
            </div>

            <div className="flex items-center space-x-2">
                <WishlistDropdown loggedIn={!!user} whiteText={true} />
                <CartDropdown loggedIn={!!user} whiteText={true} />

                {user ? (
                    <UserDropdown
                        whiteText={true}
                        userData={userData}
                        darkMode={darkMode}
                        updateTheme={updateTheme}
                        desktopOnly={true}
                    />
                ) : (
                    <BetterLink href="/login">
                        <div className="flex space-x-1 text-white items-center justify-center rounded-lg px-4 py-2 transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800">
                            <LoginIcon className="h-5 w-5" />
                            <div className="font-semibold">Login</div>
                        </div>
                    </BetterLink>
                )}
            </div>
        </nav>
    );
}

export function BankNavBar() {
    const [scrolled, setScrolled] = useState(0);
    const [menuClosed, setMenuClosed] = useState(true);

    const handleScroll = () => setScrolled(window.scrollY);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const router = useRouter();

    const { user, userData } = useUser();
    const { darkMode, updateTheme } = useTheme();

    const openMenu = () => setMenuClosed(false);
    const closeMenu = () => setMenuClosed(true);

    const displayName = userData?.['name'];

    const navigateTo = (path) => {
        closeMenu();
        router.push(path);
    };

    return (
        <nav
            className={`flex items-center justify-between border-b bg-blue-500 px-4 py-2 shadow dark:border-transparent dark:bg-zinc-900 dark:text-white md:px-12 ${
                scrolled || 'border-transparent shadow-none'
            }`}
        >
            {menuClosed || (
                <div className="fixed flex flex-col justify-between inset-0 z-50 bg-white/70 backdrop-blur-lg dark:bg-zinc-900/70 md:hidden md:bg-white md:dark:bg-zinc-900">
                    <div className="relative flex items-center justify-center px-2.5 py-4">
                        <BankLogo />
                        <button
                            className="absolute right-4 rounded-full p-2 md:hidden"
                            onClick={closeMenu}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex flex-col px-8 py-4 space-y-2 text-center">
                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/')}
                        >
                            Return to Please Buy Us
                        </BetterLink>

                        <BetterLink
                            className="px-4 py-2 rounded-lg font-semibold bg-blue-300/20 text-blue-600 dark:text-white dark:bg-zinc-700/40"
                            onClick={() => navigateTo('/settings')}
                        >
                            Settings
                        </BetterLink>
                    </div>

                    {user ? (
                        <div className="relative flex items-center justify-center px-2.5 py-4">
                            <Avatar size={30} />
                            {displayName && (
                                <div className="ml-2 text-sm font-semibold md:block">
                                    {displayName}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="m-4 flex flex-col space-y-2">
                            <BetterLink href="/signup">
                                <div className="flex items-center text-white border-transparent justify-center space-x-2 rounded-lg border px-4 py-2 transition duration-150 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100">
                                    <div className="font-semibold">Sign up</div>
                                </div>
                            </BetterLink>
                            <BetterLink href="/login">
                                <div className="flex items-center text-white border-transparent justify-center space-x-2 rounded-lg border px-4 py-2 transition duration-150 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100">
                                    <div className="font-semibold">Login</div>
                                </div>
                            </BetterLink>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center space-x-2">
                {menuClosed && (
                    <button className="p-2" onClick={openMenu}>
                        <MenuIcon className="h-6 w-6 text-white md:hidden" />
                    </button>
                )}
                <BankLogo />
            </div>

            <div className="flex items-center space-x-2">
                {user ? (
                    <UserDropdown
                        whiteText={true}
                        userData={userData}
                        darkMode={darkMode}
                        updateTheme={updateTheme}
                        desktopOnly={true}
                        bankMode={true}
                    />
                ) : (
                    <BetterLink href="/login">
                        <div className="flex space-x-1 text-white items-center justify-center rounded-lg px-4 py-2 transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800">
                            <LoginIcon className="h-5 w-5" />
                            <div className="font-semibold">Login</div>
                        </div>
                    </BetterLink>
                )}
            </div>
        </nav>
    );
}
