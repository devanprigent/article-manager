export function ErrorMessage(message: string) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
      <p className="m-0 font-semibold">Unable to load articles.</p>
      <p className="m-0 mt-2 text-sm">{message}</p>
    </div>
  );
}
