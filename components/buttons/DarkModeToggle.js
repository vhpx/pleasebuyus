export default function DarkModeToggle({
    darkMode,
    updateTheme,
    className,
    hideLabel,
}) {
    const toggleDarkMode = () => {
        localStorage.setItem('pbu-dark-mode', (!darkMode).toString());
        updateTheme(!darkMode);
    };

    return (
        <div
            className={`flex items-center justify-between space-x-4 ${className}`}
        >
            {hideLabel || (
                <div className="font-semibold dark:text-zinc-300">Light</div>
            )}
            <button
                type="button"
                aria-pressed="false"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-zinc-600"
                onClick={toggleDarkMode}
            >
                <span className="sr-only">Toggle Themes</span>
                <span
                    aria-hidden="true"
                    className={`
                  ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                  } dark:bg-dark-700 inline-block h-5 w-5
                  transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                `}
                />
            </button>
            {hideLabel || (
                <div className="font-semibold text-zinc-400 dark:text-white">
                    Dark
                </div>
            )}
        </div>
    );
}

export function BlockDarkModeToggle({ darkMode, updateTheme, className }) {
    const toggleDarkMode = () => {
        localStorage.setItem('pbu-dark-mode', (!darkMode).toString());
        updateTheme(!darkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-between px-4 py-2 ${className}`}
        >
            <div className="font-semibold dark:text-zinc-300">Light</div>
            <button
                type="button"
                aria-pressed="false"
                className="relative mx-5 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-zinc-600"
                onClick={toggleDarkMode}
            >
                <span className="sr-only">Toggle Themes</span>
                <span
                    aria-hidden="true"
                    className={`
                  ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                  } dark:bg-dark-700 inline-block h-5 w-5
                  transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                `}
                />
            </button>
            <div className="font-semibold text-zinc-400 dark:text-white">
                Dark
            </div>
        </button>
    );
}
