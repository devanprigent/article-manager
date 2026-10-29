import { useState, type CSSProperties, type HTMLAttributes } from 'react';
import { Bookmark, XCircle } from 'react-feather';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ArticleLink } from '../../features/library/components/ArticleLink';
import { formatCreatedDate } from '../../helpers/helpers';
import { Article } from '../../types/types';
import { GripIcon } from '../ui/GripIcon';

interface FeedItemProps {
  article: Article;
  onClear: (article: Article) => void;
  onReadLater?: (article: Article) => void;
  isClearPending: boolean;
  isDarkMode: boolean;
  reorderable?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  containerRef?: (node: HTMLElement | null) => void;
  containerStyle?: CSSProperties;
  isDragging?: boolean;
}

export function FeedItem({
  article,
  onClear,
  onReadLater,
  isClearPending,
  isDarkMode,
  reorderable = false,
  dragHandleProps,
  containerRef,
  containerStyle,
  isDragging = false,
}: Readonly<FeedItemProps>) {
  const [isActionVisible, setIsActionVisible] = useState(false);
  const showActions = isActionVisible || isDragging;
  const actionVisibilityClass = showActions ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0';
  const actionButtonClass = `absolute top-0 z-20 inline-flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
    isDarkMode
      ? 'border-slate-500 bg-slate-700 text-violet-300 shadow-md shadow-black/40 hover:bg-violet-900/40 hover:text-violet-200'
      : 'border-slate-200 bg-white text-violet-500 hover:bg-violet-50 hover:text-violet-600'
  } ${actionVisibilityClass}`;

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className="relative overflow-visible"
      onBlur={() => setIsActionVisible(false)}
      onFocus={() => setIsActionVisible(true)}
      onMouseEnter={() => setIsActionVisible(true)}
      onMouseLeave={() => setIsActionVisible(false)}
    >
      <article
        className={`rounded-xl border px-3 py-3 shadow-sm transition hover:-translate-y-0.5 ${
          isDarkMode
            ? 'border-slate-700 bg-slate-800 shadow-black/10 hover:border-violet-500/70 hover:shadow-lg hover:shadow-black/25'
            : 'border-slate-200 bg-white hover:border-violet-200 hover:shadow-md'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          {reorderable && (
            <button
              type="button"
              className={`inline-flex shrink-0 cursor-grab touch-none items-center justify-center rounded-md p-0 transition active:cursor-grabbing ${
                isDarkMode ? 'text-slate-500 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              } ${actionVisibilityClass}`}
              aria-label={`Reorder ${article.title}`}
              title="Drag to reorder"
              {...dragHandleProps}
            >
              <GripIcon />
            </button>
          )}
          <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className={`text-base font-semibold leading-snug ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <ArticleLink
                  id={article.id}
                  className={`text-inherit no-underline transition-colors ${isDarkMode ? 'hover:text-indigo-300' : 'hover:text-indigo-600'}`}
                >
                  {article.title}
                </ArticleLink>
              </h2>
              <p className={`mt-1 truncate text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{article.author}</p>
            </div>
            <time dateTime={article.date_modification} className={`shrink-0 text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {formatCreatedDate(article.date_modification)}
            </time>
          </div>
        </div>
      </article>

      {onReadLater && (
        <button
          type="button"
          aria-label={`Read later: ${article.title}`}
          title="Read later"
          onClick={() => onReadLater(article)}
          disabled={isClearPending}
          className={`right-10 ${actionButtonClass}`}
        >
          <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        aria-label={`Remove: ${article.title}`}
        title="Remove"
        onClick={() => onClear(article)}
        disabled={isClearPending}
        className={`right-0 ${actionButtonClass}`}
      >
        <XCircle size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

export function SortableFeedItem({
  article,
  onClear,
  isClearPending,
  isDarkMode,
}: Readonly<Pick<FeedItemProps, 'article' | 'onClear' | 'isClearPending' | 'isDarkMode'>>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.id });

  return (
    <FeedItem
      article={article}
      onClear={onClear}
      isClearPending={isClearPending}
      isDarkMode={isDarkMode}
      reorderable
      containerRef={setNodeRef}
      containerStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : undefined,
        zIndex: isDragging ? 20 : undefined,
      }}
      isDragging={isDragging}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
