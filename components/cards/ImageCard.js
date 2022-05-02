import Card from '../common/Card';

export default function ImageCard({ name, desc, imageUrl, alt }) {
    return (
        <Card className="p-0 mb-7">
            <div className="h-48 rounded-t-lg">
                {imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={imageUrl}
                        alt={alt ?? 'an image'}
                        className="h-full w-full rounded-t-lg"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 dark:from-green-300/70 dark:via-blue-500/70 dark:to-purple-600/70 rounded-t-lg" />
                )}
            </div>
            <div className="rounded-b-lg m-3">
                <div className="font-semibold text-xl">{name ?? 'Unnamed'}</div>
                <div className="text-sm">{desc}</div>
            </div>
        </Card>
    );
}
