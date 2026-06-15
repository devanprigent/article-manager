import { useArticles } from '../../hooks/queries';
import { Feed } from '../layout/Feed';
import PageHeader from '../layout/PageHeader';

const EMPTY_MESSAGE = 'No read-later articles yet. Enable it when editing an article from the Articles page.';

function ReadLaterPage() {
  const { data: { articles = [] } = {}, error, isLoading } = useArticles();
  const readLaterArticles = articles.filter((article) => article.read_later);

  return (
    <div className="space-y-5">
      <PageHeader title="Read later" description="Articles you plan to revisit.">
        <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
          {readLaterArticles.length} marked
        </span>
      </PageHeader>

      <Feed articles={readLaterArticles} emptyMessage={EMPTY_MESSAGE} isLoading={isLoading} error={error} />
    </div>
  );
}

export default ReadLaterPage;
