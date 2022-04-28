import { Popover } from '@headlessui/react';
import {
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import BetterLink from '../link/BetterLink';
import Avatar from '../common/Avatar';
import { BlockDarkModeToggle } from '../buttons/DarkModeToggle';

export default function UserDropdown({
    whiteText,
    userData,
    darkMode,
    updateTheme,
    desktopOnly,
}) {
    const displayName = userData?.['name'];

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <Popover className={`relative ${desktopOnly && 'hidden md:block'}`}>
            <Popover.Button
                className={`flex items-center justify-center rounded-lg px-4 py-2 transition duration-300 hover:bg-white/10 dark:hover:bg-zinc-800`}
            >
                <Avatar size={30} />
                {displayName && (
                    <div
                        className={`ml-2 hidden text-sm ${
                            whiteText && 'text-white'
                        } font-semibold md:block`}
                    >
                        {displayName}
                    </div>
                )}
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[3.5rem] z-10">
                <div className="my-1 flex w-48 flex-col rounded-lg bg-white/50 shadow backdrop-blur dark:bg-zinc-700/50">
                    <BetterLink
                        href="/settings"
                        className="rounded-t-lg px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                    >
                        Settings
                    </BetterLink>
                    <BetterLink
                        href="/outlets"
                        className="px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                    >
                        Outlets
                    </BetterLink>
                    <BlockDarkModeToggle
                        className="font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                        darkMode={darkMode}
                        updateTheme={updateTheme}
                    />

                    <BetterLink
                        onClick={handleLogout}
                        className="rounded-b-lg px-4 py-2 font-semibold hover:bg-red-500 hover:text-white dark:hover:bg-red-500/70"
                    >
                        Log out
                    </BetterLink>
                </div>
            </Popover.Panel>
        </Popover>
    );
}
