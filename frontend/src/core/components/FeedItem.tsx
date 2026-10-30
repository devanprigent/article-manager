import { useState, type CSSProperties, type HTMLAttributes } from 'react';
import { Bookmark, XCircle } from 'react-feather';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UseMutateFunction } from '@tanstack/react-query';

import { formatCreatedDate } from '../../helpers/helpers';
import { Article } from '../../types/types';
import { ArticleLink } from '../ui/ArticleLink';
import { GripIcon } from '../ui/GripIcon';
import { RemoveButton } from './buttons/RemoveButton';

interface FeedItemProps {
  article: Article;
  onClear?: (article: Article) => void;
  onReadLater?: (article: Article) => void;
  onDelete?: UseMutateFunction<number, unknown, number[], unknown>;
  isClearPending?: boolean;
  isDeletePending?: boolean;
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
  onDelete,
  isClearPending = false,
  isDeletePending = false,
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
  const actionButtonClass = `inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
    isDarkMode ? 'border-slate-500 bg-slate-700 shadow-md shadow-black/40' : 'border-slate-200 bg-white'
  }`;
  const readLaterColorClass = isDarkMode
    ? 'text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300'
    : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700';
  const clearColorClass = isDarkMode
    ? 'text-blue-400 hover:bg-blue-900/40 hover:text-blue-300'
    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700';
  const removeColorClass = isDarkMode ? 'text-red-400 hover:bg-red-900/40 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600';

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
                  url={article.url}
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

      <div className={`absolute -right-4 top-0 z-20 flex -translate-y-1/2 gap-2 ${actionVisibilityClass}`}>
        {onReadLater && (
          <button
            type="button"
            aria-label={`Read later: ${article.title}`}
            title="Mark as read-later"
            onClick={() => onReadLater(article)}
            disabled={isClearPending}
            className={`${actionButtonClass} ${readLaterColorClass}`}
          >
            <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}

        {onClear && (
          <button
            type="button"
            aria-label={`Clear: ${article.title}`}
            title="Clear article from feed"
            onClick={() => onClear(article)}
            disabled={isClearPending}
            className={`${actionButtonClass} ${clearColorClass}`}
          >
            <XCircle size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        )}

        {onDelete && (
          <div className={`${actionButtonClass} ${removeColorClass}`}>
            <RemoveButton itemId={article.id} remove={onDelete} isPending={isDeletePending} title={'Delete this article?'} />
          </div>
        )}
      </div>
    </div>
  );
}

export function SortableFeedItem({
  article,
  onClear,
  onDelete,
  isClearPending,
  isDeletePending,
  isDarkMode,
}: Readonly<Pick<FeedItemProps, 'article' | 'onClear' | 'onDelete' | 'isClearPending' | 'isDeletePending' | 'isDarkMode'>>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.id });

  return (
    <FeedItem
      article={article}
      onClear={onClear}
      onDelete={onDelete}
      isClearPending={isClearPending}
      isDeletePending={isDeletePending}
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
