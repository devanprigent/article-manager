import { useParams } from 'react-router-dom';

import { useArticle } from '../../hooks/queries';
import { ContentVisualizer } from '../layout/ContentVisualizer';
import { MetadataVisualizer } from '../layout/MetadataVisualizer';

function ReadingPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const isValidArticleId = Number.isInteger(articleId) && articleId > 0;
  const { data: article, isLoading, isError } = useArticle(articleId);

  if (!isValidArticleId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
        Invalid article id.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
        Loading article...
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
        Article not found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <MetadataVisualizer article={article} />
      <ContentVisualizer article={article} />
    </div>
  );
}

export default ReadingPage;
