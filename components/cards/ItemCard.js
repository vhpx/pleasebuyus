import Card from '../common/Card';

export default function ItemCard({
    name,
    price,
    imageUrl,
    alt,
    star,
    numSold,
}) {
    return (
        <Card className="h-[27rem] p-0 mb-7 ">
            <div className="h-56 rounded-t-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={alt ?? 'an image'}
                    className="h-full w-full rounded-t-lg"
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div className="rounded-b-lg m-3">
                <div className="text-xl">{name ?? 'Unnamed'}</div>
                <div className="text-base font-bold text-blue-600 dark:text-blue-300">{price}</div>
                <div className="text-sm">
                    {star} - {numSold} sold
                </div>
                <button className="mt-5 w-full mx-auto text-sm rounded-full border-2 border-zinc-500/70 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-500 dark:hover:bg-white/10 text-zinc-700/70 dark:text-zinc-300 dark:hover:text-white hover:text-white font-semibold px-4 py-1 transition duration-300">
                    Add to cart
                </button>
            </div>
        </Card>
    );
}
