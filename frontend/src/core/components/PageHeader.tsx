import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

function PageHeader({ title, description, children }: Readonly<PageHeaderProps>) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800/80">
      <div className="space-y-1">
        <h2 className="m-0 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="m-0 text-sm leading-snug text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export default PageHeader;
