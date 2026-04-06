import { ReactNode } from 'react';

interface StatsGraphWidgetProps {
  title: string;
  description: string;
  emptyMessage: string;
  hasData: boolean;
  children: ReactNode;
}

function StatsGraphWidget({ title, description, emptyMessage, hasData, children }: Readonly<StatsGraphWidgetProps>) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">{description}</p>
      {hasData ? (
        <div className="h-80 w-full">{children}</div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-600 dark:text-slate-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export default StatsGraphWidget;
