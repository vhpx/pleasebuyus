import BetterLink from '../link/BetterLink';

export default function Footer() {
    return (
        <footer className="bg-white pt-4 pb-8 dark:bg-zinc-900 xl:pt-8">
            <div className="mx-auto max-w-screen-lg px-4 text-zinc-400 dark:text-zinc-300 sm:px-6 md:px-8 xl:max-w-screen-xl">
                <div className="flex items-center justify-center pt-4 text-center font-normal">
                    Powered by{' '}
                    <BetterLink
                        href="https://www.vohoangphuc.com"
                        className="ml-1 font-semibold text-zinc-600 dark:text-zinc-200"
                    >
                        Insert Team Name
                    </BetterLink>
                </div>
            </div>
        </footer>
    );
}
