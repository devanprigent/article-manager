import { ReactNode } from 'react';
import { Article } from '../../constants/types';
import { useArticles } from '../../hooks/queries';
import { LoadingIcon } from '../features/LoadingIcon';
import { CardGrid } from '../layout/CardGrid';
import PageHeader from '../layout/PageHeader';
import { GridPageCardAction } from '../../constants/types';

interface GridPageProps {
  title: string;
  description: string;
  emptyMessage: string;
  filter: (article: Article) => boolean;
  badge: (count: number) => ReactNode;
  clearPatch: (article: Article) => Article;
  cardAction: GridPageCardAction;
}

function GridPage({ title, description, emptyMessage, filter, badge, clearPatch, cardAction }: Readonly<GridPageProps>) {
  const { data: { articles = [] } = {}, error, isLoading } = useArticles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
        <LoadingIcon width={32} height={32} />
      </div>
    );
  }
  const filtered = articles.filter(filter);

  return (
    <div className="space-y-5">
      <PageHeader title={title} description={description}>
        {badge(filtered.length)}
      </PageHeader>

      <CardGrid articles={filtered} emptyMessage={emptyMessage} clearPatch={clearPatch} cardAction={cardAction} error={error} />
    </div>
  );
}

export default GridPage;
