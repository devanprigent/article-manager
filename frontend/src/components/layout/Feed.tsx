import { useState } from 'react';
import { XCircle } from 'react-feather';

import { Article } from '../../constants/types';
import { formatCreatedDate } from '../../helpers/helpers';
import { useEditArticle } from '../../hooks/mutations';
import { ArticleLink } from '../features/ArticleLink';
import { ErrorMessage } from '../features/ErrorMessage';
import { LoadingIcon } from '../features/LoadingIcon';

interface FeedProps {
  articles: Article[];
  emptyMessage: string;
  isLoading: boolean;
  error: Error | null;
}

interface FeedItemProps {
  article: Article;
  onClearReadLater: (article: Article) => void;
  isClearPending: boolean;
}

function FeedItem({ article, onClearReadLater, isClearPending }: Readonly<FeedItemProps>) {
  const [isActionVisible, setIsActionVisible] = useState(false);
  const actionVisibilityClass = isActionVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0';

  return (
    <div
      className="relative overflow-visible"
      onBlur={() => setIsActionVisible(false)}
      onFocus={() => setIsActionVisible(true)}
      onMouseEnter={() => setIsActionVisible(true)}
      onMouseLeave={() => setIsActionVisible(false)}
    >
      <article className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-700">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              <ArticleLink id={article.id} className="text-inherit no-underline transition-colors hover:text-indigo-600 dark:hover:text-indigo-300">
                {article.title}
              </ArticleLink>
            </h2>
            <p className="mt-1 truncate text-sm font-medium text-slate-600 dark:text-slate-300">{article.author}</p>
          </div>
          <time dateTime={article.date_creation} className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
            {formatCreatedDate(article.date_creation)}
          </time>
        </div>
      </article>

      <button
        type="button"
        aria-label={`Remove from read later: ${article.title}`}
        title="Remove from read later"
        onClick={() => onClearReadLater(article)}
        disabled={isClearPending}
        className={`absolute right-0 top-0 z-20 inline-flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-violet-500 shadow-sm transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-violet-900/30 dark:text-violet-300 dark:hover:text-violet-200 ${actionVisibilityClass}`}
      >
        <XCircle size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

export function Feed({ articles, emptyMessage, isLoading, error }: Readonly<FeedProps>) {
  const { mutate: editArticle, isPending: isEditPending } = useEditArticle();

  function handleClearReadLater(article: Article): void {
    editArticle({ ...article, read_later: false });
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
        <LoadingIcon width={32} height={32} />
      </div>
    );
  }

  if (error) {
    return ErrorMessage(error.message);
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 overflow-visible rounded-2xl py-2 pl-3 pr-6 pt-3">
      {articles.map((article) => (
        <FeedItem key={article.id} article={article} onClearReadLater={handleClearReadLater} isClearPending={isEditPending} />
      ))}
    </div>
  );
}
