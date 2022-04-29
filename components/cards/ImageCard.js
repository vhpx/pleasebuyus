import Card from '../common/Card';

export default function ImageCard({ name, desc, src, alt }) {
    return (
        <Card className="p-0 mb-7">
            <div className="h-48 rounded-t-lg">
                <img
                    src={src}
                    alt={alt ?? 'an image'}
                    className="h-full w-full rounded-t-lg"
                />
            </div>
            <div className="rounded-b-lg m-3">
                <div className="font-semibold text-xl">{name ?? 'Unnamed'}</div>
                <div className="text-sm">{desc}</div>
            </div>
        </Card>
    );
}
