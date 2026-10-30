import AddButton from '../../core/components/buttons/AddButton';
import { Feed } from '../../core/components/Feed';
import PageHeader from '../../core/ui/PageHeader';
import { useRemoveArticle } from '../../hooks/mutations';
import { useArticles } from '../../hooks/queries';

const EMPTY_MESSAGE = 'No read-later articles yet. Newly added articles appear here automatically.';

function ReadLaterPage() {
  const {
    data: { articles = [], total = 0 } = {},
    error,
    isLoading,
  } = useArticles(undefined, undefined, undefined, {
    read_later: true,
  });
  const { mutate: remove, isPending: isDeletePending } = useRemoveArticle();

  return (
    <div className="space-y-5">
      <PageHeader title="Read Later" description="Articles you plan to revisit. Drag the handle to reorder.">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            {total} total
          </span>
          <AddButton title={'Add article'} />
        </div>
      </PageHeader>

      <Feed
        articles={articles}
        emptyMessage={EMPTY_MESSAGE}
        isLoading={isLoading}
        error={error}
        clearPatch={(article) => ({ ...article, read_later: false })}
        onDelete={remove}
        isDeletePending={isDeletePending}
        reorderable
      />
    </div>
  );
}

export default ReadLaterPage;
