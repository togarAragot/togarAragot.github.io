window.FormatUtil = {
    numberFormat: Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
    }),
    formatTimePassed(amount) {
        const days = Math.floor(amount / (24 * 3600));
        amount %= 24 * 3600;
        const hours = Math.floor(amount / 3600);
        amount %= 3600;
        const minutes = Math.floor(amount / 60);
        amount %= 60;
        const seconds = Math.floor(amount);

        return [
            days ? `${days}d` : '',
            hours ? `${hours}h` : '',
            minutes ? `${minutes}m` : '',
            seconds ? `${seconds}s` : '',
        ].filter(Boolean).join(' ');
    }
};
