export default function ImageCard({ name, desc, src, alt }) {
    return (
        <div className="h-80 border border-zinc-300 dark:border-zinc-700/70 rounded-lg">
            <div className=" h-3/4 rounded-t-lg">
                <img
                    src={src}
                    alt={alt ?? 'an image'}
                    className="h-full w-full rounded-t-lg"
                />
            </div>
            <div className=" h-1/4 rounded-b-lg m-3">
                <div className="font-semibold text-xl">{name ?? 'Unnamed'}</div>
                <div className="text-sm">{desc}</div>
            </div>
        </div>
    );
}
