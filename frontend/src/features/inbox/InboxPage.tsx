import { Feed } from '../../core/components/Feed';
import PageHeader from '../../core/components/PageHeader';
import { useArticles } from '../../hooks/queries';

const EMPTY_MESSAGE = 'Your inbox is empty. New articles from your RSS feeds will show up here.';

function InboxPage() {
  const {
    data: { articles = [], total = 0 } = {},
    error,
    isLoading,
  } = useArticles(undefined, undefined, undefined, {
    rss: true,
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Inbox" description="New articles from your RSS feeds.">
        <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
          {total} new
        </span>
      </PageHeader>

      <Feed
        articles={articles}
        emptyMessage={EMPTY_MESSAGE}
        isLoading={isLoading}
        error={error}
        clearPatch={(article) => ({ ...article, rss: false })}
        readLaterPatch={(article) => ({ ...article, rss: false, read_later: true })}
      />
    </div>
  );
}

export default InboxPage;
