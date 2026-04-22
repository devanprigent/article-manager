import { ReactNode } from 'react';

interface StatsGraphWidgetProps {
  title: string;
  description: string;
  emptyMessage: string;
  hasData: boolean;
  isDarkMode: boolean;
  children: ReactNode;
}

function StatsGraphWidget({ title, description, emptyMessage, hasData, isDarkMode, children }: Readonly<StatsGraphWidgetProps>) {
  return (
    <section
      className={`min-w-0 rounded-2xl border p-5 shadow-sm ${
        isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200/80 bg-white text-slate-800'
      }`}
    >
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className={`mb-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
      {hasData ? (
        <div className="h-80 min-h-[320px] w-full min-w-0">{children}</div>
      ) : (
        <div
          className={`rounded-xl border border-dashed p-8 text-center ${
            isDarkMode ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-500'
          }`}
        >
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export default StatsGraphWidget;
