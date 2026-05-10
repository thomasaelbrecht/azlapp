"use client";

interface FormattedDateProps {
  className?: string;
  date: Date | string;
  includeTime?: boolean;
}

const dateFormat = new Intl.DateTimeFormat("nl-BE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("nl-BE", {
  hour: "2-digit",
  minute: "2-digit",
});

const formatDate = (date: Date, includeTime: boolean) => {
  const datePart = dateFormat.format(date);
  if (!includeTime) return datePart;
  return `${datePart} ${timeFormat.format(date)}`;
};

export function FormattedDateTime({ className = "", date, includeTime = false }: FormattedDateProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return (
    <time className={className} dateTime={dateObj.toISOString()}>
      {formatDate(dateObj, includeTime)}
    </time>
  );
}
