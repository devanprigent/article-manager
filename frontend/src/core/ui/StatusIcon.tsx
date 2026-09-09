interface StatusIconProps {
  active: boolean;
}

function StatusIcon({ active }: Readonly<StatusIconProps>) {
  if (active) {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
        aria-label="Success"
        title="Yes"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42 0L4.29 10.266a1 1 0 0 1 1.414-1.414l3.046 3.046 6.54-6.596a1 1 0 0 1 1.414-.012Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
      aria-label="Failure"
      title="No"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 0 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </span>
  );
}

export default StatusIcon;
