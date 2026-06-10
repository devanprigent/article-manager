import { Article, GridPageCardAction } from '../../constants/types';
import { useIsDarkMode } from '../../contexts/ThemeContext';
import { useEditArticle } from '../../hooks/mutations';
import { Card } from '../features/Card';
import { ErrorMessage } from '../features/ErrorMessage';

interface PropsType {
  articles: Article[];
  emptyMessage: string;
  clearPatch: (article: Article) => Article;
  cardAction: GridPageCardAction;
  error: Error | null;
}

export function CardGrid({ articles, emptyMessage, clearPatch, cardAction, error }: Readonly<PropsType>) {
  const isDarkMode = useIsDarkMode();
  const { mutate: editArticle, isPending: isEditPending } = useEditArticle();

  function handleClear(article: Article): void {
    editArticle(clearPatch(article));
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
    <div className="rounded-2xl p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <Card
            key={article.id}
            id={article.id}
            title={article.title}
            author={article.author}
            year={article.year}
            isDarkMode={isDarkMode}
            {...(cardAction === 'liked'
              ? { onUnlike: () => handleClear(article), isUnlikePending: isEditPending }
              : { onClearReadLater: () => handleClear(article), isClearReadLaterPending: isEditPending })}
          />
        ))}
      </div>
    </div>
  );
}
