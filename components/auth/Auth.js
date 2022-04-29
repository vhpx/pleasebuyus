import {
    AtSymbolIcon,
    CheckCircleIcon,
    LockClosedIcon,
} from '@heroicons/react/outline';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setServerSideCookie } from '../../hooks/useUser';
import { EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from '../../utils/constants';
import { supabase } from '../../utils/supabase-client';
import FormInput from '../form/FormInput';
import FormSubmit from '../form/FormSubmit';
import BetterLink from '../link/BetterLink';

export default function Auth({ signUp }) {
    const [confirmEmailSent, setConfirmEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirectUrl = '/dashboard';

    const handleAuth = async () => {
        try {
            setLoading(true);
            const { user, session, error } = await (signUp
                ? supabase.auth.signUp({ email, password })
                : supabase.auth.signIn(
                      { email, password },
                      { redirectTo: redirectUrl }
                  ));

            if (error) throw error;

            if (signUp) {
                setConfirmEmailSent(true);
                return;
            }

            const { refresh_token } = session;

            supabase.auth.setSession(refresh_token);
            setServerSideCookie('SIGNED_IN', session);
        } catch (error) {
            toast.error(error.error_description || error.message);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center md:justify-center ">
            <div className="fixed -z-10 h-screen w-screen bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:bg-gradient-to-br dark:from-[#380036] dark:to-[#0cbaba] md:bg-gradient-to-r"></div>

            {confirmEmailSent || (
                <BetterLink
                    href="/"
                    className="m-4 flex items-center space-x-1 rounded-lg bg-white py-3 pl-4 pr-6 font-bold shadow transition duration-300 hover:bg-white hover:shadow-xl md:absolute md:top-0 md:left-0 md:m-8 md:bg-white/60"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                    <div>Back</div>
                </BetterLink>
            )}

            <div className="rounded-lg border bg-white px-4 py-4 shadow dark:border-transparent dark:bg-zinc-800/60 dark:text-zinc-200 md:m-16 md:px-16">
                {confirmEmailSent ? (
                    <div className="flex flex-col items-center space-y-8">
                        <div className="text-center text-3xl font-bold">
                            Your account has been created!
                        </div>
                        <CheckCircleIcon className="w-5h-52 h-52 text-green-400" />
                        <div className="text-center text-xl font-bold">
                            Please check your email to confirm your account.
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="mb-8 flex items-center justify-center border-b py-2 text-lg font-bold md:text-xl">
                            <div>
                                {signUp ? 'Sign up to ' : 'Sign in to '}
                                <BetterLink
                                    className="transition duration-300 hover:text-blue-600 dark:hover:text-blue-300"
                                    href="/?no-redirect"
                                >
                                    pleasebuy.us
                                </BetterLink>
                            </div>
                        </h1>

                        <div>
                            <div className="mt-8">
                                <form autoComplete="off">
                                    <FormInput
                                        id="email"
                                        label="Email"
                                        placeholder={EMAIL_PLACEHOLDER}
                                        setter={setEmail}
                                    >
                                        <AtSymbolIcon className="h-4 w-4" />
                                    </FormInput>
                                    <FormInput
                                        id="password"
                                        type="password"
                                        label="Password"
                                        placeholder={PASSWORD_PLACEHOLDER}
                                        setter={setPassword}
                                    >
                                        <LockClosedIcon className="h-4 w-4" />
                                    </FormInput>

                                    {signUp || (
                                        <div className="flex items-center">
                                            <div className="ml-auto flex">
                                                <BetterLink
                                                    href="/forgot-password"
                                                    className="inline-flex py-2 text-xs font-thin text-zinc-500 hover:text-zinc-700 dark:text-zinc-200 sm:text-sm"
                                                >
                                                    Forgot Your Password?
                                                </BetterLink>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`${
                                            signUp && 'mt-11'
                                        } flex w-full justify-center`}
                                    >
                                        <FormSubmit
                                            label={signUp ? 'Sign Up' : 'Login'}
                                            loadingLabel={
                                                signUp
                                                    ? 'Signing up'
                                                    : 'Logging in'
                                            }
                                            className="dark:border-zinc-300"
                                            loading={loading}
                                            onClick={handleAuth}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* <div className="my-4 border-t pt-4 text-center font-semibold dark:border-zinc-500 md:text-xl md:font-bold">
                    Social login
                </div>
                <div className="item-center grid grid-cols-1 gap-4 md:grid-cols-3">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200 "
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="mr-2"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
                        </svg>
                        Facebook
                    </button>
                    <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200 "
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="mr-2"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white "
                        onClick={() =>
                            supabase.auth.signIn({ provider: 'github' })
                        }
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="mr-2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                        </svg>
                        Github
                    </button>
                </div> */}
                    </div>
                )}
            </div>

            {confirmEmailSent || (
                <BetterLink
                    href={signUp ? '/login' : '/signup'}
                    className="mx-8 my-4 rounded-lg border bg-white px-6 py-4 shadow transition duration-300 hover:shadow-xl dark:border-transparent dark:bg-zinc-800/60 dark:text-zinc-200 dark:hover:bg-zinc-800 md:absolute md:bottom-0 md:right-0 md:my-16"
                >
                    <div className="text-zinc-600 dark:text-zinc-200">
                        {signUp
                            ? 'Already have an account?'
                            : "Don't have an account?"}
                    </div>
                    <div className="text-2xl font-bold">
                        {signUp ? 'Login' : 'Sign Up'}
                    </div>
                </BetterLink>
            )}
        </div>
    );
}
