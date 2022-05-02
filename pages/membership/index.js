import { SparklesIcon } from '@heroicons/react/outline';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import { useUser } from '../../hooks/useUser';

MembershipPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

export default function MembershipPage() {
    const { userData } = useUser();

    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <Title label="Membership" />
                    <Divider />

                    <div className="grid grid-cols-1 lg:grid-cols-3 space-x-8">
                        <div className="pr-4">
                            <div className="flex items-center mb-8">
                                <Avatar size={100} />
                                <div className="ml-4">
                                    <div className="text-2xl font-bold">
                                        {userData?.name || userData?.email}
                                    </div>

                                    <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-300">
                                        <SparklesIcon className="w-6 h-6" />
                                        <div className="text-lg font-semibold">
                                            Silver
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div>
                                <div className="flex justify-between text-zinc-600/70 dark:text-zinc-300 items-end mb-1">
                                    <div className="text-2xl font-bold">
                                        Silver
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">
                                        45%
                                    </span>
                                </div>

                                <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
                                    <div
                                        className="bg-zinc-600/70 dark:bg-zinc-300 h-2.5 rounded-full"
                                        style={{
                                            width: '45%',
                                        }}
                                    />
                                </div>

                                <div className="mt-4 text-sm">
                                    Get{' '}
                                    <span className="font-semibold">122</span>{' '}
                                    more points to unlock{' '}
                                    <span className="ml-1 font-semibold text-yellow-700 px-4 py-1 rounded-lg bg-yellow-500/20 dark:text-yellow-300">
                                        Gold
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Title label="Tier Benefits" />
                            <Divider />
                            <div className="w-3/4 grid grid-cols-5 mt-2 gap-2 font-semibold text-center">
                                <Card className="cursor-pointer p-2 text-green-600 hover:text-green-700 bg-green-400/20 hover:bg-green-400/30 border-green-600/20 hover:border-green-600/50 dark:text-green-300 dark:hover:text-green-100 dark:bg-green-200/20 dark:hover:bg-green-400/30 dark:border-green-300/20 dark:hover:border-green-300/50">
                                    Member
                                </Card>
                                <Card className="cursor-pointer p-2 text-yellow-700 hover:text-yellow-800 bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-600/20 hover:border-yellow-600/50 dark:text-yellow-500 dark:hover:text-yellow-300 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30 dark:border-yellow-600/20 dark:hover:border-yellow-600/50">
                                    Bronze
                                </Card>
                                <Card className="cursor-pointer p-2 text-zinc-600 hover:text-zinc-700 bg-zinc-400/20 hover:bg-zinc-400/30 border-zinc-500/20 hover:border-zinc-500/50 dark:text-zinc-300 dark:hover:text-zinc-100 dark:bg-zinc-200/20 dark:hover:bg-zinc-400/30 dark:border-zinc-200/20 dark:hover:border-zinc-200/50">
                                    Silver
                                </Card>
                                <Card className="cursor-pointer p-2 text-yellow-600 hover:text-yellow-700 bg-yellow-400/20 hover:bg-yellow-400/30 border-yellow-600/20 hover:border-yellow-600/50 dark:text-yellow-300 dark:hover:text-yellow-100 dark:bg-yellow-200/20 dark:hover:bg-yellow-400/30 dark:border-yellow-300/20 dark:hover:border-yellow-300/50">
                                    Gold
                                </Card>
                                <Card className="cursor-pointer p-2 text-sky-600 hover:text-sky-700 bg-sky-400/20 hover:bg-sky-400/30 border-sky-500/20 hover:border-sky-500/50 dark:text-sky-300 dark:hover:text-sky-100 dark:bg-sky-200/20 dark:hover:bg-sky-400/30 dark:border-sky-300/20 dark:hover:border-sky-300/50">
                                    Platinum
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
