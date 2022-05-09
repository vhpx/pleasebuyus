export const currencyFormatter = (currency) =>
    Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency ?? 'USD',
        minimumFractionDigits: 2,
    });

export const formatCurrency = (value, currency) =>
    currencyFormatter(currency).format(value);
