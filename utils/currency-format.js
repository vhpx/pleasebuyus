export const currencyFormatter = (currency) =>
    Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency ?? 'USD',
    });

export const formatCurrency = (value, currency) =>
    currencyFormatter(currency).format(value);
