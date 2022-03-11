import '../styles/tailwind.css';
import ToastWrapper from '../components/toast/ToastWrapper';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <Head>
                <title>Please buy us</title>
                <meta
                    name="description"
                    content="Buy everything you ever need, affordably."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
            </Head>
            {getLayout(<Component {...pageProps} />)}
            <ToastWrapper />
        </>
    );
}

export default MyApp;
