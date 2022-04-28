import '../styles/tailwind.css';
import ToastWrapper from '../components/toast/ToastWrapper';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { CartProvider } from '../hooks/useCart';
import { UserProvider } from '../hooks/useUser';
import { ThemeProvider } from '../hooks/useTheme';

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <ThemeProvider>
            <UserProvider>
                <CartProvider>
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
                    <ToastWrapper />
                    {getLayout(<Component {...pageProps} />)}
                </CartProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

export default MyApp;
