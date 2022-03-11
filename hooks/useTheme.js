import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('pbu-dark-mode');
        if (isDarkMode) {
            setDarkMode(isDarkMode === 'true');
            document.documentElement.className =
                isDarkMode === 'true' ? 'dark' : '';
        }
    }, [setDarkMode]);

    const updateTheme = (isDarkMode) => {
        document.documentElement.className = isDarkMode ? 'dark' : '';
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
