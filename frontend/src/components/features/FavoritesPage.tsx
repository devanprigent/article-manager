// Libraries
// Configuration Files
import { Article } from "../../constants/types";
import { useArticles } from "../../redux/selectors";
// Components
import Card from "./Card";
import PageHeader from "../layout/PageHeader";

/**
 * This component generates the Tag page.
 */
function FavoritesPage() {
  const articles = useArticles();
  const favoris = articles.filter(
    (article: Article) => article.favorite === true
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Favoris"
        description="Retrouvez rapidement les articles que vous voulez relire."
      >
        <span className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {favoris.length} article{favoris.length > 1 ? "s" : ""} en favori
        </span>
      </PageHeader>

      {favoris.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
          Aucun favori pour le moment. Ajoutez des favoris depuis la page
          Articles.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favoris.map((article: Article) => (
            <Card
              key={article.id}
              title={article.title}
              author={article.author}
              year={article.year}
              url={article.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Exportation
export default FavoritesPage;
