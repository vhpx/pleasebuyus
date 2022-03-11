import { ToastContainer } from 'react-toastify';

export default function ToastWrapper() {
    return <ToastContainer position="bottom-left" newestOnTop limit={7} />;
}
