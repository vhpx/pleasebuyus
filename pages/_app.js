import ToastWrapper from '../components/toast/ToastWrapper';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            {getLayout(<Component {...pageProps} />)}
            <ToastWrapper />
        </>
    );
}

export default MyApp;
