import Auth from '../components/auth/Auth';
import { AuthRedirect } from '../hooks/useUser';

export default function SignUpPage() {
    AuthRedirect();

    return <Auth signUp={true} />;
}
