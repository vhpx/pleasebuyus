import Card from '../common/Card';

export default function TierCard({ tier, selected }) {
    const getCardStyle = (tier) => {
        switch (tier.name) {
            case 'Member':
                if (selected)
                    return 'cursor-pointer p-2 font-semibold text-green-700 hover:text-green-700 bg-green-400/30 hover:bg-green-400/30 border-green-600/50 hover:border-green-600/50 dark:text-green-100 dark:hover:text-green-100 dark:bg-green-400/30 dark:hover:bg-green-400/30 dark:border-green-300/50 dark:hover:border-green-300/50';

                return 'opacity-80 cursor-pointer p-2 font-semibold text-green-600 hover:text-green-700 bg-green-400/10 hover:bg-green-400/30 border-green-600/20 hover:border-green-600/50 dark:text-green-300 dark:hover:text-green-100 dark:bg-green-400/5 dark:hover:bg-green-400/30 dark:border-green-300/20 dark:hover:border-green-300/50';

            case 'Silver':
                if (selected)
                    return 'cursor-pointer p-2 font-semibold text-blue-700 hover:text-blue-700 bg-blue-400/30 hover:bg-blue-400/30 border-blue-600/50 hover:border-blue-600/50 dark:text-blue-100 dark:hover:text-blue-100 dark:bg-blue-400/30 dark:hover:bg-blue-400/30 dark:border-blue-300/50 dark:hover:border-blue-300/50';

                return 'opacity-80 cursor-pointer p-2 font-semibold text-blue-600 hover:text-blue-700 bg-blue-400/10 hover:bg-blue-400/30 border-blue-600/20 hover:border-blue-600/50 dark:text-blue-300 dark:hover:text-blue-100 dark:bg-blue-400/5 dark:hover:bg-blue-400/30 dark:border-blue-300/20 dark:hover:border-blue-300/50';

            case 'Gold':
                if (selected)
                    return 'cursor-pointer p-2 font-semibold text-yellow-700 hover:text-yellow-700 bg-yellow-400/30 hover:bg-yellow-400/30 border-yellow-600/50 hover:border-yellow-600/50 dark:text-yellow-100 dark:hover:text-yellow-100 dark:bg-yellow-400/30 dark:hover:bg-yellow-400/30 dark:border-yellow-300/50 dark:hover:border-yellow-300/50';

                return 'opacity-80 cursor-pointer p-2 font-semibold text-yellow-600 hover:text-yellow-700 bg-yellow-400/10 hover:bg-yellow-400/30 border-yellow-600/20 hover:border-yellow-600/50 dark:text-yellow-300 dark:hover:text-yellow-100 dark:bg-yellow-400/5 dark:hover:bg-yellow-400/30 dark:border-yellow-300/20 dark:hover:border-yellow-300/50';

            case 'Platinum':
                if (selected)
                    return 'cursor-pointer p-2 font-semibold text-sky-700 hover:text-sky-700 bg-sky-400/30 hover:bg-sky-400/30 border-sky-600/50 hover:border-sky-600/50 dark:text-sky-100 dark:hover:text-sky-100 dark:bg-sky-400/30 dark:hover:bg-sky-400/30 dark:border-sky-300/50 dark:hover:border-sky-300/50';

                return 'opacity-80 cursor-pointer p-2 font-semibold text-sky-600 hover:text-sky-700 bg-sky-400/10 hover:bg-sky-400/30 border-sky-600/20 hover:border-sky-600/50 dark:text-sky-300 dark:hover:text-sky-100 dark:bg-sky-400/5 dark:hover:bg-sky-400/30 dark:border-sky-300/20 dark:hover:border-sky-300/50';

            default:
                return 'opacity-80 cursor-pointer p-2 font-semibold text-gray-700 bg-gray-400/30 border-gray-600/50 dark:text-gray-100 dark:bg-gray-400/30 dark:border-gray-300/50';
        }
    };

    return <Card className={getCardStyle(tier)}>{tier.name}</Card>;
}
