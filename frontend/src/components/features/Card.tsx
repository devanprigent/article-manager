import { useState } from 'react';
import { Heart, XCircle } from 'react-feather';

import { ArticleLink } from './ArticleLink';

interface PropsType {
  id: number;
  title: string;
  author: string;
  year: number;
  isDarkMode: boolean;
  onUnlike?: () => void;
  isUnlikePending?: boolean;
  onClearReadLater?: () => void;
  isClearReadLaterPending?: boolean;
}

export function Card({
  id,
  title,
  author,
  year,
  isDarkMode,
  onUnlike,
  isUnlikePending = false,
  onClearReadLater,
  isClearReadLaterPending = false,
}: Readonly<PropsType>) {
  const [isActionVisible, setIsActionVisible] = useState(false);
  const actionVisibilityClass = isActionVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0';

  return (
    <div
      onBlur={() => setIsActionVisible(false)}
      onFocus={() => setIsActionVisible(true)}
      onMouseEnter={() => setIsActionVisible(true)}
      onMouseLeave={() => setIsActionVisible(false)}
      className={`relative h-full rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
      }`}
    >
      {onUnlike && (
        <button
          type="button"
          aria-label={`Remove like for ${title}`}
          title="Remove like"
          onClick={onUnlike}
          disabled={isUnlikePending}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300 ${actionVisibilityClass}`}
        >
          <Heart size={18} fill="currentColor" aria-hidden="true" />
        </button>
      )}
      {onClearReadLater && (
        <button
          type="button"
          aria-label={`Remove from read later: ${title}`}
          title="Remove from read later"
          onClick={onClearReadLater}
          disabled={isClearReadLaterPending}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center text-violet-500 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-violet-300 ${actionVisibilityClass}`}
        >
          <XCircle size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
      <div className="flex h-full flex-col justify-between gap-4">
        <h1 className="pr-10 text-base font-semibold leading-snug text-slate-800 dark:text-slate-100">
          <ArticleLink id={id} className="text-inherit no-underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-300">
            {title}
          </ArticleLink>
        </h1>
        <div className="flex items-center justify-between rounded-xl bg-slate-200 px-3 py-2 dark:bg-slate-700/60">
          <span className="max-w-[70%] truncate text-sm font-medium text-slate-600 dark:text-slate-200">{author}</span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {year}
          </span>
        </div>
      </div>
    </div>
  );
}
