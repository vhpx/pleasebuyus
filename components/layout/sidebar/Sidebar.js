import { Tooltip } from '@mui/material';
import { useRouter } from 'next/router';

import {
    AdjustmentsIcon as OutlinedAdjustmentsIcon,
    UsersIcon as OutlinedUsersIcon,
    LibraryIcon as OutlinedLibraryIcon,
    ShoppingBagIcon as OutlinedShoppingBagIcon,
    TagIcon as OutlinedTagIcon,
    TicketIcon as OutlinedTicketIcon,
    TemplateIcon as OutlinedTemplateIcon,
    CreditCardIcon as OutlinedCreditCardIcon,
} from '@heroicons/react/outline';

import {
    LogoutIcon as MenuOpenIcon,
    AdjustmentsIcon as SolidAdjustmentsIcon,
    UsersIcon as SolidUsersIcon,
    LibraryIcon as SolidLibraryIcon,
    ShoppingBagIcon as SolidShoppingBagIcon,
    TagIcon as SolidTagIcon,
    TicketIcon as SolidTicketIcon,
    TemplateIcon as SolidTemplateIcon,
    CreditCardIcon as SolidCreditCardIcon,
} from '@heroicons/react/solid';

import SidebarTab from './SidebarTab';
import { useUser } from '../../../hooks/useUser';
import Logo from '../../common/Logo';

export default function Sidebar({ className }) {
    const router = useRouter();
    const { user } = useUser();

    const navigateTo = (e, href) => {
        e.preventDefault();
        router.push(href);
    };

    const collapsed = false;

    return (
        <div
            className={`${className} fixed z-50 h-full max-h-full overflow-x-visible border-r bg-white/70 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:text-white md:bg-white md:dark:bg-zinc-900`}
        >
            <div className="flex h-full max-h-full flex-col justify-between">
                <div className="flex-none">
                    <div
                        className={`relative items-center justify-center px-2.5 ${
                            collapsed ? 'hidden md:flex' : 'py-4'
                        }`}
                    >
                        {collapsed ? (
                            <div className="flex-col">
                                <Tooltip
                                    title="Expand sidebar"
                                    placement="bottom-end"
                                    arrow={true}
                                >
                                    <button
                                        onClick={openSidebar}
                                        className="my-[0.825rem] rounded-lg p-2 text-sm font-semibold text-zinc-500 transition duration-300 hover:bg-blue-100/50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-700/40 dark:hover:text-white"
                                    >
                                        <MenuOpenIcon className="h-5 w-5" />
                                    </button>
                                </Tooltip>
                            </div>
                        ) : (
                            <div className="mx-2 mt-2 flex justify-center py-4 md:py-0">
                                <Logo
                                    onClick={(e) =>
                                        navigateTo(e, '/?no-redirect=true')
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {collapsed && (
                        <div className="hidden h-[0.5px] w-full translate-y-[0.1rem] bg-zinc-300 dark:bg-zinc-800 md:block" />
                    )}
                </div>

                <nav
                    id="sidebar-nav"
                    className={`${
                        collapsed ? 'hidden' : 'place-content-stretch'
                    } space-y-2 md:grid md:grid-cols-1 h-full overflow-y-auto scrollbar-none`}
                >
                    <div className="h-0" />

                    <SidebarTab
                        href="/dashboard"
                        label="Dashboard"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard')}
                        inactiveIcon={
                            <OutlinedAdjustmentsIcon className="h-5 w-5" />
                        }
                        activeIcon={
                            <SolidAdjustmentsIcon className="h-5 w-5" />
                        }
                    />

                    <SidebarTab
                        href="/dashboard/users"
                        label="Users"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/users')}
                        inactiveIcon={<OutlinedUsersIcon className="h-5 w-5" />}
                        activeIcon={<SolidUsersIcon className="h-5 w-5" />}
                    />

                    <SidebarTab
                        href="/dashboard/banks"
                        label="Banks"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/banks')}
                        inactiveIcon={
                            <OutlinedLibraryIcon className="h-5 w-5" />
                        }
                        activeIcon={<SolidLibraryIcon className="h-5 w-5" />}
                    />

                    <SidebarTab
                        href="/dashboard/cards"
                        label="Bank Cards"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/cards')}
                        inactiveIcon={
                            <OutlinedCreditCardIcon className="h-5 w-5" />
                        }
                        activeIcon={<SolidCreditCardIcon className="h-5 w-5" />}
                    />

                    <SidebarTab
                        href="/dashboard/outlets"
                        label="Outlets"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/outlets')}
                        inactiveIcon={
                            <OutlinedShoppingBagIcon className="h-5 w-5" />
                        }
                        activeIcon={
                            <SolidShoppingBagIcon className="h-5 w-5" />
                        }
                    />

                    <SidebarTab
                        href="/dashboard/products"
                        label="Products"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/products')}
                        inactiveIcon={<OutlinedTagIcon className="h-5 w-5" />}
                        activeIcon={<SolidTagIcon className="h-5 w-5" />}
                    />

                    <SidebarTab
                        href="/dashboard/coupons"
                        label="Coupons"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/coupons')}
                        inactiveIcon={
                            <OutlinedTicketIcon className="h-5 w-5" />
                        }
                        activeIcon={<SolidTicketIcon className="h-5 w-5" />}
                    />

                    <SidebarTab
                        href="/dashboard/categories"
                        label="Global Categories"
                        currentPath={router.pathname}
                        onClick={(e) => navigateTo(e, '/dashboard/categories')}
                        inactiveIcon={
                            <OutlinedTemplateIcon className="h-5 w-5" />
                        }
                        activeIcon={<SolidTemplateIcon className="h-5 w-5" />}
                    />

                    <div className="h-8 md:h-4" />
                </nav>
            </div>
        </div>
    );
}
