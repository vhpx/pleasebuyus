import { useTheme } from '../../hooks/useTheme';

export default function DefaultAvatar({ size }) {
    const { darkMode } = useTheme();

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="200"
                cy="200"
                r="200"
                fill={darkMode ? 'white' : 'black'}
            />
            <circle
                cx="200"
                cy="200"
                r="175"
                fill={darkMode ? 'black' : 'white'}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M228.771 146H286.506L199.904 296L113.301 146H171.036L156.603 121L70 121L199.904 346L329.808 121H243.205L228.771 146Z"
                fill={darkMode ? 'white' : 'black'}
            />
        </svg>
    );
}
