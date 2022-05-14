import { Popover } from '@headlessui/react';
import { supabase } from '../../utils/supabase-client';
import Avatar from '../common/Avatar';
import { BlockDarkModeToggle } from '../buttons/DarkModeToggle';
import { useRouter } from 'next/router';

export default function UserDropdown({
    whiteText,
    userData,
    darkMode,
    updateTheme,
    desktopOnly,
    bankMode,
    dashboardMode,
}) {
    const router = useRouter();

    const navigateTo = (path, onNavigate) => {
        router.push(path);
        if (onNavigate) onNavigate();
    };

    const email = userData?.email;
    const displayName = userData?.name;

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <Popover className={`relative ${desktopOnly && 'hidden md:block'}`}>
            <Popover.Button
                className={`flex items-center justify-center rounded-lg px-4 py-2 transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800`}
            >
                <Avatar
                    url={userData?.avatar_url}
                    alt={(userData?.name || userData?.email) + "'s avatar"}
                    size={30}
                />
                {(email || displayName) && (
                    <div
                        className={`ml-2 hidden text-sm ${
                            whiteText && 'text-white'
                        } font-semibold md:block`}
                    >
                        {displayName || email}
                    </div>
                )}
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[3.5rem] z-10">
                {({ close }) => (
                    <div className="my-1 flex w-64 flex-col rounded-lg bg-white/80 shadow backdrop-blur dark:bg-zinc-800/80">
                        {bankMode || dashboardMode ? (
                            <>
                                <button
                                    className="text-left rounded-t-lg px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                    onClick={() => navigateTo('/', close)}
                                >
                                    Return to Please Buy Us
                                </button>
                            </>
                        ) : (
                            <>
                                {userData?.isAdmin && (
                                    <button
                                        className="text-left rounded-t-lg px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                        onClick={() =>
                                            navigateTo('/dashboard', close)
                                        }
                                    >
                                        Admin Dashboard
                                    </button>
                                )}
                                <button
                                    className="text-left rounded-t-lg px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                    onClick={() =>
                                        navigateTo('/outlets', close)
                                    }
                                >
                                    Outlets
                                </button>

                                <button
                                    className="text-left px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                    onClick={() =>
                                        navigateTo('/membership', close)
                                    }
                                >
                                    Membership
                                </button>

                                <button
                                    className="text-left px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                    onClick={() =>
                                        navigateTo('/history', close)
                                    }
                                >
                                    Purchase History
                                </button>

                                <button
                                    className="text-left rounded-t-lg px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                                    onClick={() => navigateTo('/banks', close)}
                                >
                                    Banks
                                </button>
                            </>
                        )}

                        <BlockDarkModeToggle
                            className="font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                            darkMode={darkMode}
                            updateTheme={updateTheme}
                        />

                        <button
                            className="text-left px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                            onClick={() => navigateTo('/settings', close)}
                        >
                            Settings
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-left rounded-b-lg px-4 py-2 font-semibold hover:bg-red-500 hover:text-white dark:hover:bg-red-500/70"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    );
}
