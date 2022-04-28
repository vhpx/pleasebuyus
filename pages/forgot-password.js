import { useRouter } from 'next/router';
import { useState } from 'react';

import {
    BadgeCheckIcon,
    ChevronLeftIcon,
    MailIcon,
} from '@heroicons/react/solid';

import { supabase } from '../utils/supabase-client';
import BetterLink from '../components/link/BetterLink';
import FormInput from '../components/form/FormInput';
import FormSubmit from '../components/form/FormSubmit';
import DefaultAvatar from '../components/common/DefaultAvatar';
import { WEBSITE_URL } from '../utils/constants';
import { AuthRedirect } from '../hooks/useUser';

export default function ForgotPasswordPage() {
    AuthRedirect('/reset-password');

    const router = useRouter();
    const { email: inputEmail } = router.query;

    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const [email, setEmail] = useState(inputEmail ?? '');

    const sendRecoveryEmail = async () => {
        setLoading(true);

        if (email) {
            const { data } = await supabase.auth.api.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${WEBSITE_URL}/reset-password`,
                }
            );

            if (data) setSent(true);
        }

        setLoading(false);
    };

    return (
        <div className="relative text-black dark:text-white flex h-screen flex-col items-center justify-center bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:bg-gradient-to-br dark:from-[#0d324d] dark:to-[#7f5a83] md:bg-gradient-to-r">
            <BetterLink
                href="/login"
                className="m-8 flex items-center space-x-1 rounded-lg bg-white/60 py-3 pl-4 pr-6 font-bold shadow transition duration-300 hover:bg-white hover:shadow-xl dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-900 md:absolute md:top-0 md:left-0"
            >
                <ChevronLeftIcon className="h-6 w-6" />
                <div>Back</div>
            </BetterLink>

            <div className="m-16 flex flex-col items-center rounded-lg border bg-white px-4 py-4 shadow dark:border-transparent dark:bg-zinc-800/60 dark:text-white md:px-16">
                <h1 className="mb-8 flex text-center items-center justify-center border-b py-2 text-xl font-bold dark:border-zinc-500">
                    {sent ? 'Recovery email sent' : 'Forgot your password?'}
                </h1>

                {sent || (
                    <div className="mb-4 flex justify-center items-center">
                        <DefaultAvatar value={email} size={80} />
                    </div>
                )}

                {sent ? (
                    <BadgeCheckIcon className="h-40 w-40 text-green-500" />
                ) : (
                    <>
                        <FormInput
                            id="email"
                            label="Email"
                            placeholder="example@domain.com"
                            value={email}
                            setter={setEmail}
                        >
                            <MailIcon className="h-4 w-4" />
                        </FormInput>

                        <FormSubmit
                            className="mt-4"
                            label="Send recovery email"
                            loadingLabel="Sending"
                            loading={loading}
                            onClick={sendRecoveryEmail}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
