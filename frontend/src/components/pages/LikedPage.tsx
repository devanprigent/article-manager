import { useArticles } from '../../hooks/queries';
import { CardGrid } from '../layout/CardGrid';
import PageHeader from '../layout/PageHeader';

const EMPTY_MESSAGE = 'No liked articles yet. Mark articles as liked from the Articles page.';

function LikedPage() {
  const {
    data: { articles = [], total = 0 } = {},
    error,
    isLoading,
  } = useArticles(undefined, undefined, undefined, {
    liked: true,
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Likes" description="Quickly find the articles you liked.">
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {total} liked
        </span>
      </PageHeader>

      <CardGrid
        articles={articles}
        emptyMessage={EMPTY_MESSAGE}
        clearPatch={(article) => ({ ...article, liked: false })}
        cardAction="liked"
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default LikedPage;
