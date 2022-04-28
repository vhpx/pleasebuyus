import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase-client';
import { useRouter } from 'next/router';

const UserContext = createContext();

export const UserProvider = (props) => {
    const [passwordRecovery, setPasswordRecovery] = useState(false);

    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const onPasswordUpdated = () => {
        setPasswordRecovery((_) => false);
    };

    const fetchUserData = async (currentSession) => {
        if (currentSession?.user) {
            const response = await fetch('/api/user');
            const userData = await response.json();

            setUserData(userData);
        }
    };

    const updateUserData = async ({
        name,
        birthday,
        gender,
        phoneNumber,
        avatarUrl,
    }) => {
        if (!userData) return;

        setUserData((prevData) => ({
            name: name ?? prevData?.name,
            email: prevData?.email,
            birthday: birthday ?? prevData?.birthday,
            gender: gender ?? prevData?.gender,
            phone_number: phoneNumber ?? prevData?.phone_number,
            avatar_url: avatarUrl ?? prevData?.avatar_url,
        }));
    };

    useEffect(() => {
        const session = supabase.auth.session();

        setSession(session);
        setUser(session?.user);
        fetchUserData(session);

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setServerSideCookie(event, session);
                setSession(session);
                setUser(session?.user);

                if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);

                if (session?.user) {
                    const response = await fetch('/api/user');
                    const userData = await response.json();

                    setUserData(userData);
                } else {
                    setUserData(null);
                }
            }
        );

        return () => {
            authListener.unsubscribe();
        };
    }, [user]);

    const values = {
        session,
        user,
        userData,
        passwordRecovery,
        fetchUserData,
        updateUserData,
        onPasswordUpdated,
    };
    return <UserContext.Provider value={values} {...props} />;
};

export const signOut = async () => {
    await supabase.auth.signOut();
};

export const RequireAuth = (redirectPath) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            const sessionUser = supabase.auth.session()?.user;
            if (!sessionUser) router.push(redirectPath ?? '/login');
        }
    }, [redirectPath, user, router]);
};

export const AuthRedirect = (redirectPath) => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push(redirectPath ?? '/');
        }
    }, [redirectPath, user, router]);
};

export const setServerSideCookie = (event, session) =>
    fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
    }).then((res) => res.json());

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be used within a UserProvider.`);
    }
    return context;
};

export const AuthUser = () => {
    const { user } = useUser();
    return user;
};
