import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, setMantineTheme }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('pbu-dark-mode');
        if (isDarkMode) {
            const newDarkmode = isDarkMode === 'true';
            const newTheme = newDarkmode ? 'dark' : 'light';

            document.documentElement.className =
                isDarkMode === 'true' ? 'dark' : '';
            setMantineTheme(newTheme);

            setDarkMode(newDarkmode);
        }
    }, [setDarkMode, setMantineTheme]);

    const updateTheme = (isDarkMode) => {
        document.documentElement.className = isDarkMode ? 'dark' : '';
        localStorage.setItem('pbu-dark-mode', isDarkMode);

        setMantineTheme(isDarkMode ? 'dark' : 'light');
        setDarkMode(isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(`useTheme must be used within a ThemeProvider.`);
    }
    return context;
};
