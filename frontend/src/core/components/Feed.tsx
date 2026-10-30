import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useIsDarkMode } from '../../contexts/ThemeContext';
import { useEditArticle, useRemoveArticle, useReorderReadLater } from '../../hooks/mutations';
import { Article } from '../../types/types';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingIcon } from '../ui/LoadingIcon';
import { FeedItem, SortableFeedItem } from './FeedItem';

interface FeedProps {
  articles: Article[];
  emptyMessage: string;
  isLoading: boolean;
  error: Error | null;
  clearPatch?: (article: Article) => Article;
  readLaterPatch?: (article: Article) => Article;
  reorderable?: boolean;
}

export function Feed({ articles, emptyMessage, isLoading, error, clearPatch, readLaterPatch, reorderable = false }: Readonly<FeedProps>) {
  const isDarkMode = useIsDarkMode();
  const { mutate: editArticle, isPending: isEditPending } = useEditArticle();
  const { mutate: remove, isPending: isDeletePending } = useRemoveArticle();
  const { mutate: reorderReadLater, isPending: isReorderPending } = useReorderReadLater();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleClear = clearPatch ? (article: Article) => editArticle(clearPatch(article)) : undefined;

  const handleReadLater = readLaterPatch ? (article: Article) => editArticle(readLaterPatch(article)) : undefined;

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = articles.findIndex((article) => article.id === active.id);
    const newIndex = articles.findIndex((article) => article.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

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
      <div className="mx-auto flex max-w-3xl flex-col gap-3 overflow-visible rounded-2xl pb-2 pl-3 pr-6">
        {articles.map((article) => (
          <FeedItem
            key={article.id}
            article={article}
            onClear={handleClear}
            onReadLater={handleReadLater}
            onDelete={remove}
            isClearPending={isEditPending}
            isDeletePending={isDeletePending}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={articles.map((article) => article.id)} strategy={verticalListSortingStrategy}>
        <div className={`mx-auto flex max-w-3xl flex-col gap-3 overflow-visible rounded-2xl pb-2 pl-3 pr-6 ${isReorderPending ? 'opacity-80' : ''}`}>
          {articles.map((article) => (
            <SortableFeedItem
              key={article.id}
              article={article}
              onClear={handleClear}
              onDelete={remove}
              isClearPending={isEditPending}
              isDeletePending={isDeletePending}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
