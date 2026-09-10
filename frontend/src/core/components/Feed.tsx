import { useState, type CSSProperties, type HTMLAttributes } from 'react';
import { XCircle } from 'react-feather';

import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useIsDarkMode } from '../../contexts/ThemeContext';
import { ArticleLink } from '../../features/articles/components/ArticleLink';
import { formatCreatedDate } from '../../helpers/helpers';
import { useEditArticle, useReorderReadLater } from '../../hooks/mutations';
import { Article } from '../../types/types';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingIcon } from '../ui/LoadingIcon';
import { GripIcon } from './GripIcon';

interface FeedItemProps {
  article: Article;
  onClear: (article: Article) => void;
  isClearPending: boolean;
  isDarkMode: boolean;
  reorderable?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  containerRef?: (node: HTMLElement | null) => void;
  containerStyle?: CSSProperties;
  isDragging?: boolean;
}

function FeedItem({
  article,
  onClear,
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

      <button
        type="button"
        aria-label={`Remove: ${article.title}`}
        title="Remove"
        onClick={() => onClear(article)}
        disabled={isClearPending}
        className={`absolute right-0 top-0 z-20 inline-flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isDarkMode
            ? 'border-slate-500 bg-slate-700 text-violet-300 shadow-md shadow-black/40 hover:bg-violet-900/40 hover:text-violet-200'
            : 'border-slate-200 bg-white text-violet-500 hover:bg-violet-50 hover:text-violet-600'
        } ${actionVisibilityClass}`}
      >
        <XCircle size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

function SortableFeedItem({
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

interface FeedProps {
  articles: Article[];
  emptyMessage: string;
  isLoading: boolean;
  error: Error | null;
  clearPatch: (article: Article) => Article;
  reorderable?: boolean;
}

export function Feed({ articles, emptyMessage, isLoading, error, clearPatch, reorderable = false }: Readonly<FeedProps>) {
  const isDarkMode = useIsDarkMode();
  const { mutate: editArticle, isPending: isEditPending } = useEditArticle();
  const { mutate: reorderReadLater, isPending: isReorderPending } = useReorderReadLater();
  const [orderedArticles, setOrderedArticles] = useState(articles);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleClear(article: Article): void {
    editArticle(clearPatch(article));
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedArticles.findIndex((article) => article.id === active.id);
    const newIndex = orderedArticles.findIndex((article) => article.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    setOrderedArticles((current) => arrayMove(current, oldIndex, newIndex));
    reorderReadLater({ old_rank: oldIndex, new_rank: newIndex });
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border p-6 shadow-sm ${
          isDarkMode ? 'border-slate-700 bg-slate-800/80 text-slate-300' : 'border-slate-200/80 bg-white/90 text-slate-600'
        }`}
      >
        <LoadingIcon width={32} height={32} />
      </div>
    );
  }

  if (error) {
    return ErrorMessage(error.message);
  }

  if (articles.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-dashed p-10 text-center ${
          isDarkMode ? 'border-slate-600 bg-slate-800/50 text-slate-300' : 'border-slate-300 text-slate-500'
        }`}
      >
        {emptyMessage}
      </div>
    );
  }

  if (!reorderable) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-3 overflow-visible rounded-2xl py-2 pl-3 pr-6 pt-3">
        {articles.map((article) => (
          <FeedItem key={article.id} article={article} onClear={handleClear} isClearPending={isEditPending} isDarkMode={isDarkMode} />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedArticles.map((article) => article.id)} strategy={verticalListSortingStrategy}>
        <div
          className={`mx-auto flex max-w-3xl flex-col gap-3 overflow-visible rounded-2xl py-2 pl-3 pr-6 pt-3 ${isReorderPending ? 'opacity-80' : ''}`}
        >
          {orderedArticles.map((article) => (
            <SortableFeedItem key={article.id} article={article} onClear={handleClear} isClearPending={isEditPending} isDarkMode={isDarkMode} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
