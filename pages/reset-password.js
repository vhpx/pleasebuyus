import { useRouter } from 'next/router';
import { useState } from 'react';

import { LockClosedIcon as LockClosedIconOutline } from '@heroicons/react/outline';
import {
    BadgeCheckIcon,
    ChevronLeftIcon,
    LockClosedIcon,
} from '@heroicons/react/solid';

import Avatar from '../components/common/Avatar';
import { RequireAuth, useUser } from '../hooks/useUser';
import { supabase } from '../utils/supabase-client';
import BetterLink from '../components/link/BetterLink';
import FormInput from '../components/form/FormInput';
import FormSubmit from '../components/form/FormSubmit';

export default function ResetPasswordPage() {
    RequireAuth('/forgot-password');

    const router = useRouter();
    const { access_token: accessToken } = router.query;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const { session, onPasswordUpdated } = useUser();

    const updatePassword = async () => {
        setLoading(true);

        if (
            !password ||
            password.length < 8 ||
            !confirmedPassword ||
            password !== confirmedPassword
        ) {
            setLoading(false);
            return;
        }

        const { data } = await supabase.auth.api.updateUser(
            accessToken ?? session?.access_token,
            {
                password: password,
            }
        );

        if (data) {
            await supabase.auth.refreshSession();
            onPasswordUpdated();
            setSuccess(true);
        }

        setLoading(false);
    };

    return (
        <div className="relative text-black dark:text-white flex h-screen flex-col items-center md:justify-center bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-[#0d324d] dark:to-[#7f5a83] md:bg-gradient-to-r">
            <BetterLink
                href="/settings"
                className="m-8 flex items-center space-x-1 rounded-lg bg-white/60 py-3 pl-4 pr-6 font-bold shadow transition duration-300 hover:bg-white hover:shadow-xl dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-900 md:absolute md:top-0 md:left-0"
            >
                <ChevronLeftIcon className="h-6 w-6" />
                <div>Back</div>
            </BetterLink>

            <div className="md:m-16 flex flex-col items-center rounded-lg border bg-white px-4 py-4 shadow dark:border-transparent dark:bg-zinc-800/60 dark:text-white md:px-16">
                <h1 className="mb-8 flex text-center items-center justify-center border-b py-2 text-xl font-bold dark:border-zinc-500">
                    {success
                        ? 'Password updated successfully'
                        : 'Reset password'}
                </h1>

                {success || (
                    <div className="mb-4 flex justify-center items-center">
                        <Avatar size={80} />
                    </div>
                )}

                {success ? (
                    <div className="flex flex-col items-center">
                        <BadgeCheckIcon className="h-40 w-40 text-green-500" />
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex flex-col space-y-4">
                            <FormInput
                                id="password"
                                type="password"
                                label="New password"
                                placeholder="••••••••"
                                setter={setPassword}
                            >
                                <LockClosedIconOutline className="h-4 w-4" />
                            </FormInput>

                            <FormInput
                                id="confirm-password"
                                type="password"
                                label="Confirm password"
                                placeholder="••••••••"
                                setter={setConfirmedPassword}
                            >
                                <LockClosedIcon className="h-4 w-4" />
                            </FormInput>
                        </div>

                        <FormSubmit
                            label="Update password"
                            loadingLabel="Updating"
                            loading={loading}
                            onClick={updatePassword}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
