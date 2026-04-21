// Libraries
import { GridColDef } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
// Configuration Files
import { Article } from '../../constants/types';
import { useArticles } from '../../hooks/queries';
// Components
import AddButton from '../features/AddButton';
import DataTable from '../layout/DataTable';
import EditButton from '../features/EditButton';
import ArticleForm from '../forms/ArticleForm';
import PageHeader from '../layout/PageHeader';

/**
 * This component generates the Article page.
 */
function ArticlesPage() {
  const { data: articles = [] } = useArticles();
  const readCount = articles.filter((article) => article.read).length;
  const favoriteCount = articles.filter((article) => article.favorite).length;

  const TITLE_ADD_FORM: string = 'Add article';
  const newArticle: Article = {
    id: 0,
    title: '',
    author: '',
    url: '',
    year: new Date().getFullYear(),
    summary: '',
    read: false,
    read_again: false,
    favorite: false,
    tags: [],
    date_creation: '',
    date_modification: '',
  };
  const COLUMNS: GridColDef[] = [
    {
      field: 'title',
      width: 300,
      renderHeader: () => <strong className="fs-5">{'Title'}</strong>,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: params.row.read ? 'line-through' : 'none' }}>
          {params.row.title}
        </a>
      ),
    },
    {
      field: 'author',
      width: 150,
      renderHeader: () => <strong className="fs-5">{'Author'}</strong>,
    },
    {
      field: 'year',
      renderHeader: () => <strong className="fs-5">{'Year'}</strong>,
    },
    {
      field: 'date_modification',
      renderCell: (params) => {
        const date = new Date(params.row.date_modification);
        return date.toLocaleDateString('en-US');
      },
      renderHeader: () => <strong className="fs-5">{'Time'}</strong>,
    },
    {
      field: 'read',
      renderHeader: () => <strong className="fs-5">{'Read'}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.read} />,
    },
    {
      field: 'read_again',
      width: 150,
      renderHeader: () => <strong className="fs-5">{'Read Again'}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.read_again} />,
    },
    {
      field: 'favorite',
      renderHeader: () => <strong className="fs-5">{'Favorite'}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.favorite} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => <strong className="fs-5">{'Edit'}</strong>,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <EditButton activeItem={params.row} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Articles" description="Manage your library and track your reading at a glance.">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{articles.length} total</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {readCount} read
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {favoriteCount} favorites
          </span>
        </div>
      </PageHeader>

      <div className="flex justify-end">
        <AddButton FormComponent={ArticleForm} title={TITLE_ADD_FORM} activeItem={newArticle} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <DataTable data={articles} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default ArticlesPage;
