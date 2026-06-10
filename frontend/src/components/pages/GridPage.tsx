import { ReactNode } from 'react';

import { Article, GridPageCardAction } from '../../constants/types';
import { useArticles } from '../../hooks/queries';
import { CardGrid } from '../layout/CardGrid';
import PageHeader from '../layout/PageHeader';

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
  const filtered = articles.filter(filter);

  return (
    <div className="space-y-5">
      <PageHeader title={title} description={description}>
        {badge(filtered.length)}
      </PageHeader>

      <CardGrid articles={filtered} emptyMessage={emptyMessage} clearPatch={clearPatch} cardAction={cardAction} isLoading={isLoading} error={error} />
    </div>
  );
}

export default GridPage;
