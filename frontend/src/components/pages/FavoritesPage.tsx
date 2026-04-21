import { Article } from '../../constants/types';
import { useArticles } from '../../hooks/queries';
import { useIsDarkMode } from '../../redux/selectors';
import Card from '../features/Card';
import PageHeader from '../layout/PageHeader';

function FavoritesPage() {
  const { data: articles = [] } = useArticles();
  const isDarkMode = useIsDarkMode();
  const favoris = articles.filter((article: Article) => article.favorite === true);

  return (
    <div className="space-y-5">
      <PageHeader title="Favorites" description="Quickly find the articles you want to revisit.">
        <span className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          {favoris.length} favorite{favoris.length > 1 ? 's' : ''}
        </span>
      </PageHeader>

      {favoris.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
          No favorites yet. Add favorites from the Articles page.
        </div>
      ) : (
        <div className={`rounded-2xl border p-4 shadow-sm ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200/80 bg-white'}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoris.map((article: Article) => (
              <Card key={article.id} title={article.title} author={article.author} year={article.year} url={article.url} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Exportation
export default FavoritesPage;
