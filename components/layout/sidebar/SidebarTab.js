import { Tooltip } from '@mui/material';

export default function SidebarTab({
    label,
    href,
    currentPath,
    hiddenOnDesktop = false,
    isMobile = false,
    className,
    activeIcon,
    inactiveIcon,
    onClick,
    children,
}) {
    const collapsed = false;

    const isActive = currentPath === href;

    const extraCss = isActive
        ? 'text-white bg-gradient-to-br from-blue-600 via-purple-500 to-red-500 dark:hover:bg-zinc-700/40 dark:from-blue-400/50 dark:via-purple-500/50 dark:to-red-500/50'
        : 'hover:bg-blue-100/50 text-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-700/40 hover:text-blue-600 dark:hover:text-white';

    const defaultCss = `group flex cursor-pointer ${
        collapsed ? 'mx-2 justify-center' : 'px-4 py-3 mx-4 justify-start'
    } ${
        hiddenOnDesktop && 'md:hidden'
    } items-center text-sm font-semibold space-x-2 rounded-lg dark:text-white transition duration-150`;

    return (
        <div
            className={`${extraCss} ${defaultCss} ${className}`}
            onClick={onClick}
        >
            <Tooltip
                title={label}
                placement="right"
                arrow={true}
                disableHoverListener={!collapsed}
            >
                <button
                    className={`h-full w-fit flex space-x-2 items-center rounded-lg ${
                        collapsed && 'p-3 justify-center'
                    }`}
                >
                    {isActive
                        ? activeIcon ?? inactiveIcon ?? children
                        : inactiveIcon ?? children}

                    {isMobile && <div>{label}</div>}
                </button>
            </Tooltip>

            {collapsed || <div>{label}</div>}
        </div>
    );
}
