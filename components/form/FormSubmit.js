import OutlinedButton from '../buttons/OutlinedButton';

export default function FormSubmit({
    label,
    loadingLabel,
    loading,
    onClick,
    className,
}) {
    return (
        <OutlinedButton
            label={label ?? 'Submit'}
            loading={loading}
            loadingLabel={loadingLabel ?? 'Submitting'}
            onClick={onClick}
            className={className}
        />
    );
}
