import { ToastContainer } from 'react-toastify';

export default function ToastWrapper() {
    return (
        <ToastContainer
            theme={darkMode ? 'dark' : 'light'}
            position="bottom-left"
            newestOnTop
            limit={7}
        />
    );
}
