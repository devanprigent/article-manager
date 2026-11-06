import { Feed } from '../../core/components/Feed';
import PageHeader from '../../core/ui/PageHeader';
import { useArticles } from '../../hooks/queries';

const EMPTY_MESSAGE = 'No articles yet. Articles you add will show up here.';

function HistoryPage() {
  const { data: { articles = [], total = 0 } = {}, error, isLoading } = useArticles();

  return (
    <div className="space-y-5">
      <PageHeader title="History" description="Browse every article in your library.">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {total} total
        </span>
      </PageHeader>

      <Feed articles={articles} emptyMessage={EMPTY_MESSAGE} isLoading={isLoading} error={error} />
    </div>
  );
}

export default HistoryPage;
