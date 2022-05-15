function parseDate(s) {
    let b = s.split(/\D/);
    --b[1]; // Adjust month number
    b[6] = b[6].substr(0, 3); // Microseconds to milliseconds
    return new Date(Date.UTC(...b));
}

export const getRelativeTime = (timestamptz) => {
    const now = new Date();
    const then = parseDate(timestamptz);

    const diff = now.getTime() - then.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds <= 1) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;

    if (minutes <= 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;

    if (hours <= 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;

    if (days <= 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;

    if (days < 14) return '1 week ago';
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

    if (days < 60) return '1 month ago';
    if (days < 365) return `${Math.floor(days / 30)} months ago`;

    return `${Math.floor(days / 365)} years ago`;
};
