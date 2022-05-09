import { SparklesIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TierCard from '../../components/cards/TierCard';
import Avatar from '../../components/common/Avatar';
import Divider from '../../components/common/Divider';
import Title from '../../components/common/Title';
import { StoreLayout } from '../../components/layout/layout';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase-client';

MembershipPage.getLayout = (page) => {
    return <StoreLayout hideFooter={true}>{page}</StoreLayout>;
};

export default function MembershipPage() {
    RequireAuth();

    const { userData } = useUser();

    const tiers = [
        {
            name: 'Member',
            color: 'green',
            points: 0,
            benefits: ['Access to standard deals'],
        },
        {
            name: 'Silver',
            color: 'blue',
            points: 100,
            benefits: [
                'Earn 1.5x rewards points as a Silver user',
                'Get access to deals such as movie screening, flash sales and more',
            ],
        },
        {
            name: 'Gold',
            color: 'yellow',
            points: 500,
            benefits: [
                'Earn 2x rewards points as a Gold user',
                'Get access to deals such as movie screening, flash sales and more',
                'Early access to new features',
                'Priority support',
            ],
        },
        {
            name: 'Platinum',
            color: 'sky',
            points: 1000,
            benefits: [
                'Earn 3x rewards points as a Platinum user',
                'Get access to deals such as movie screening, flash sales and more',
                'Get access to exclusive deals and offers',
                'Discounted shipping',
                'Early access to new features',
                'Priority support',
            ],
        },
    ];

    const getCurrentTier = () => {
        if (progressPoints < 100) return tiers[0];
        if (progressPoints < 500) return tiers[1];
        if (progressPoints < 1000) return tiers[2];
        return tiers[3];
    };

    const getCurrentTierBg = () => {
        const { name } = getCurrentTier();

        switch (name) {
            case 'Member':
                return `bg-green-600/70 dark:bg-green-300`;

            case 'Silver':
                return `bg-blue-600/70 dark:bg-blue-300`;

            case 'Gold':
                return `bg-yellow-600/70 dark:bg-yellow-300`;

            case 'Platinum':
                return `bg-sky-600/70 dark:bg-sky-300`;

            default:
                return `bg-zinc-600/70 dark:bg-zinc-300`;
        }
    };

    const getNextTier = () => {
        if (progressPoints < 100) return tiers[1];
        if (progressPoints < 500) return tiers[2];
        return tiers[3];
    };

    const getNextTierText = () => {
        const { name } = getNextTier();

        switch (name) {
            case 'Silver':
                return 'text-blue-700 lg:bg-blue-400/20 dark:text-blue-300';

            case 'Gold':
                return 'text-yellow-700 lg:bg-yellow-400/20 dark:text-yellow-300';

            case 'Platinum':
                return 'text-sky-700 lg:bg-sky-400/20 dark:text-sky-300';

            default:
                return 'text-zinc-700 lg:bg-zinc-400/20 dark:text-zinc-300';
        }
    };

    const [selectedTier, setSelectedTier] = useState(0);

    const [progressPoints, setProgressPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userData) return;

            try {
                const { data, error } = await supabase
                    .from('memberships')
                    .select('*')
                    .eq('user_id', userData.id)
                    .single();

                if (error || !data) throw new Error(error);

                setProgressPoints(data.progress_pts);
                setLoading(false);
            } catch (error) {
                toast.error(error.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userData]);

    useEffect(() => {
        const getCurrentTier = () => {
            if (progressPoints < 100) return 0;
            if (progressPoints < 500) return 1;
            if (progressPoints < 1000) return 2;
            return 3;
        };

        const tier = getCurrentTier();
        setSelectedTier(tier);
    }, [progressPoints]);
    return (
        <div>
            <div className="p-4 md:p-8 lg:p-16 space-y-8">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                    <Title label="Membership" />
                    <Divider />

                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-8">
                        <div className="lg:pr-4">
                            <div className="flex items-center mb-8">
                                <Avatar
                                    url={userData.avatar_url}
                                    alt={
                                        (userData.name || userData.email) +
                                        "'s avatar"
                                    }
                                    size={100}
                                />
                                <div className="ml-4">
                                    <div className="text-lg md:text-2xl font-bold">
                                        {userData?.name || userData?.email}
                                    </div>

                                    <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-300">
                                        <SparklesIcon className="w-4 h-4 md:w-6 md:h-6" />
                                        <div className="text-sm md:text-lg font-semibold">
                                            {progressPoints} points
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div>
                                <div
                                    className={`flex justify-between text-${
                                        getCurrentTier().color
                                    }-600/70 dark:text-${
                                        getCurrentTier().color
                                    }-300 items-end mb-1`}
                                >
                                    <div className="text-2xl font-bold">
                                        {getCurrentTier().name}
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">
                                        {getNextTier().points} points
                                    </span>
                                </div>

                                <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
                                    <div
                                        className={`${getCurrentTierBg()} h-2.5 rounded-full`}
                                        style={{
                                            width: `${
                                                progressPoints >=
                                                getNextTier().points
                                                    ? '100'
                                                    : (progressPoints /
                                                          getNextTier()
                                                              .points) *
                                                      100
                                            }%`,
                                        }}
                                    />
                                </div>

                                {getCurrentTier().name !=
                                    getNextTier().name && (
                                    <div className="mt-4 text-sm">
                                        Get{' '}
                                        <span className="font-semibold">
                                            {getNextTier().points -
                                                progressPoints}{' '}
                                            points
                                        </span>{' '}
                                        more points to unlock{' '}
                                        <span
                                            className={`ml-1 font-semibold lg:px-4 lg:py-1 rounded-lg ${getNextTierText()}`}
                                        >
                                            {getNextTier().name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 lg:mt-0 col-span-2">
                            <Title label="Membership Tiers" />
                            <Divider />

                            <div className="lg:w-4/5 mb-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 mt-2 gap-2 text-center">
                                {tiers.map((tier, index) => (
                                    <button
                                        key={tier.name}
                                        onClick={() => setSelectedTier(index)}
                                    >
                                        <TierCard
                                            tier={tier}
                                            selected={index === selectedTier}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="text-sm lg:text-base flex flex-col items-center space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0 text-center">
                                <Title label="Tier Benefits" />
                                {tiers[selectedTier].name ===
                                    getCurrentTier().name && (
                                    <div className="font-semibold px-4 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700/70 w-fit text-zinc-500 dark:text-zinc-300">
                                        You are currently on this tier
                                    </div>
                                )}
                            </div>
                            <Divider />

                            {tiers[selectedTier].benefits.map(
                                (benefit, index) => (
                                    <div
                                        key={index}
                                        className={`${
                                            selectedTier >
                                                tiers.indexOf(
                                                    getCurrentTier()
                                                ) && 'opacity-50'
                                        } flex items-center mb-2 text-${
                                            tiers[selectedTier].color
                                        }-600 dark:text-${
                                            tiers[selectedTier].color
                                        }-300`}
                                    >
                                        {selectedTier <=
                                        tiers.indexOf(getCurrentTier()) ? (
                                            <CheckCircleIcon className="w-4 flex-none h-4 md:w-8 md:h-8 mr-2" />
                                        ) : (
                                            <LockClosedIcon className="w-4 flex-none h-4 md:w-8 md:h-8 mr-2" />
                                        )}
                                        <div className="md:text-lg font-semibold">
                                            {benefit}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
