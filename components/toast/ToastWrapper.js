import { ToastContainer } from 'react-toastify';
import { useTheme } from '../../hooks/useTheme';

export default function ToastWrapper() {
    const { darkMode } = useTheme();
    return (
        <ToastContainer
            position="bottom-left"
            newestOnTop
            limit={7}
            theme={darkMode ? 'dark' : 'light'}
        />
    );
}
