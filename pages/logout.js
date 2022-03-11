import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase-client';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut();
            router.push('/');
        };

        logout();
    }, [router]);

    return <div></div>;
}
