import { ReactNode } from 'react';
import { Bookmark, CheckCircle, ExternalLink, Heart, Tag } from 'react-feather';

import { Article } from '../../constants/types';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

type MetaSectionProps = {
  title: string;
  children: ReactNode;
};

function MetaSection({ title, children }: Readonly<MetaSectionProps>) {
  return (
    <section className="space-y-1.5">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

type MetaFieldProps = {
  label: string;
  children: ReactNode;
};

function MetaField({ label, children }: Readonly<MetaFieldProps>) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <div className="text-xs font-medium text-slate-800 dark:text-slate-100">{children}</div>
    </div>
  );
}

type StatusBadgeProps = {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeIcon: ReactNode;
  activeClassName: string;
  inactiveClassName: string;
};

function StatusBadge({ active, activeLabel, inactiveLabel, activeIcon, activeClassName, inactiveClassName }: Readonly<StatusBadgeProps>) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? activeClassName : inactiveClassName}`}
    >
      {activeIcon}
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function MetadataVisualizer({ article }: { article: Article }) {
  return (
    <aside className="w-full rounded-xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 lg:sticky lg:top-4">
      <header className="space-y-2 border-b border-slate-100 p-3 dark:border-slate-700/80">
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <h1 className="m-0 min-w-0 flex-1 text-xl font-bold leading-snug tracking-tight text-slate-950 dark:text-slate-50">{article.title}</h1>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open original source"
              title="Open original source"
              className="mt-1 shrink-0 text-slate-400 transition hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-300"
            >
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {article.liked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                <Heart size={10} fill="currentColor" aria-hidden="true" />
                Liked
              </span>
            ) : null}
            <StatusBadge
              active={article.consulted}
              activeLabel="Consulted"
              inactiveLabel="Unread"
              activeIcon={<CheckCircle size={10} aria-hidden="true" />}
              activeClassName="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              inactiveClassName="bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
            />
            {article.read_later ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                <Bookmark size={10} aria-hidden="true" />
                Read later
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="p-3">
        <MetaSection title="Metadata">
          <div className="grid grid-cols-2 gap-2 px-0.5">
            <MetaField label="Author">{article.author}</MetaField>
            <MetaField label="Published">{article.year}</MetaField>
            <MetaField label="Created">{formatDate(article.date_creation)}</MetaField>
            <MetaField label="Updated">{formatDate(article.date_modification)}</MetaField>
            <div className="col-span-2">
              <MetaField label="Tags">
                {article.tags.length ? (
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-0.5 rounded-md border border-indigo-100 bg-indigo-50/80 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300"
                      >
                        <Tag size={9} aria-hidden="true" />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">No tags assigned</span>
                )}
              </MetaField>
            </div>
          </div>
        </MetaSection>
      </div>

      {article.summary ? (
        <div className="border-t border-slate-100 p-3 dark:border-slate-700/80">
          <MetaSection title="Summary">
            <p className="m-0 text-xs leading-snug text-slate-600 dark:text-slate-300">{article.summary}</p>
          </MetaSection>
        </div>
      ) : null}
    </aside>
  );
}
