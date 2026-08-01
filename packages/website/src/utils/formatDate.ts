// Short, uppercase date for cards and article meta (e.g. "12 AVR. 2026").
// Locale-aware via Intl; accepts an ISO string or a Date.
export const formatDate = (date: string | Date, locale: string): string => {
  const value = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(value)
    .toUpperCase();
};
