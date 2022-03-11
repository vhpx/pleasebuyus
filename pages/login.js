import Auth from '../components/auth/Auth';
import { AuthRedirect } from '../hooks/useUser';

export default function LoginPage() {
    AuthRedirect();

    return <Auth signUp={false} />;
}
