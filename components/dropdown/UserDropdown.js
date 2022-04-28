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
    const [showLanguages, setShowLanguages] = useState(false);

    const displayName = userData?.['display_name'];

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <Popover className={`relative ${desktopOnly && 'hidden md:block'}`}>
            <Popover.Button
                className={`flex items-center justify-center rounded-lg border ${
                    whiteText && 'border-transparent'
                } px-4 py-2 transition duration-300 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-400`}
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

            <Popover.Panel className="absolute right-0 top-16 z-10">
                {showLanguages ? (
                    <div className="my-1 flex w-48 flex-col rounded-lg bg-white/50 shadow backdrop-blur dark:bg-zinc-700/50">
                        <button
                            onClick={() => setShowLanguages(false)}
                            className="flex items-center space-x-2 rounded-t-lg px-4 py-2 text-left font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                            <div>Back</div>
                        </button>
                        <button
                            onClick={() =>
                                handleLocaleChange(
                                    router,
                                    i18n.changeLanguage,
                                    'en'
                                )
                            }
                            className="flex items-center justify-between px-4 py-2 text-left font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                        >
                            <div className="flex items-center space-x-2">
                                <Image
                                    alt="united-states flag"
                                    src="/flags/united-states.svg"
                                    width={25}
                                    height={25}
                                />
                                <div>English</div>
                            </div>
                            {i18n.language == 'en' && (
                                <CheckCircleIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-200" />
                            )}
                        </button>
                        <button
                            onClick={() =>
                                handleLocaleChange(
                                    router,
                                    i18n.changeLanguage,
                                    'vi'
                                )
                            }
                            className="flex items-center justify-between rounded-b-lg px-4 py-2 text-left font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                        >
                            <div className="flex items-center space-x-2">
                                <Image
                                    alt="vietnam flag"
                                    src="/flags/vietnam.svg"
                                    width={25}
                                    height={25}
                                />
                                <div>Tiếng Việt</div>
                            </div>
                            {i18n.language == 'vi' && (
                                <CheckCircleIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-200" />
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="my-1 flex w-48 flex-col rounded-lg bg-white/50 shadow backdrop-blur dark:bg-zinc-700/50">
                        <BetterLink
                            href="https://www.vohoangphuc.com/settings"
                            className="px-4 py-2 font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
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
                        {/* <button
                            onClick={() => setShowLanguages(true)}
                            className="px-4 py-2 text-left font-semibold hover:bg-zinc-200/20 dark:hover:bg-zinc-700/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Image
                                        alt={
                                            i18n.language == 'en'
                                                ? 'united-states flag'
                                                : 'vietnam flag'
                                        }
                                        src={
                                            i18n.language == 'en'
                                                ? '/flags/united-states.svg'
                                                : '/flags/vietnam.svg'
                                        }
                                        width={25}
                                        height={25}
                                    />
                                    <div>
                                        {i18n.language == 'en'
                                            ? 'English'
                                            : 'Tiếng Việt'}
                                    </div>
                                </div>
                                <ChevronRightIcon className="h-5 w-5" />
                            </div>
                        </button> */}
                        <BetterLink
                            onClick={handleLogout}
                            className="rounded-b-lg px-4 py-2 font-semibold hover:bg-red-500 hover:text-white dark:hover:bg-red-500/70"
                        >
                            Log out
                        </BetterLink>
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    );
}
