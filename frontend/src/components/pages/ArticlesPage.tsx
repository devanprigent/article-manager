import { useMemo, useState } from 'react';
import { Heart } from 'react-feather';

import { GridColDef } from '@mui/x-data-grid';

import { pageSize } from '../../constants/constants';
import { useArticles, useSearch } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import AddButton from '../features/AddButton';
import { ArticleLink } from '../features/ArticleLink';
import EditButton from '../features/EditButton';
import StatusIcon from '../features/StatusIcon';
import DataTable from '../layout/DataTable';
import PageHeader from '../layout/PageHeader';

export default function ArticlesPage() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pageSize,
  });
  const [search, setSearch] = useState('');
  const debouncedSearchQuery = useDebounce(search.trim(), 500);
  const isSearching = debouncedSearchQuery?.length > 0;
  const articlesQuery = useArticles(isSearching, paginationModel.page, paginationModel.pageSize);
  const searchQueryResult = useSearch(debouncedSearchQuery, paginationModel.page, paginationModel.pageSize);
  const { data: { articles = [], total = 0 } = {}, isFetching, error } = isSearching ? searchQueryResult : articlesQuery;
  const isMdUp = useMediaQuery('(min-width: 768px)');

  const columnVisibilityModel = useMemo(
    () => ({
      year: isMdUp,
      date_creation: isMdUp,
      consulted: isMdUp,
      read_later: isMdUp,
      liked: isMdUp,
    }),
    [isMdUp],
  );

  const COLUMNS: GridColDef[] = useMemo(
    () => [
      {
        field: 'title',
        flex: 1,
        minWidth: isMdUp ? 200 : 140,
        renderHeader: () => <strong className="fs-5">{'Title'}</strong>,
        renderCell: (params) => (
          <ArticleLink
            id={params.row.id}
            style={{ textDecoration: params.row.consulted ? 'line-through' : 'none' }}
            className="text-inherit hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            {params.row.title}
          </ArticleLink>
        ),
      },
      {
        field: 'author',
        width: isMdUp ? 150 : 110,
        renderHeader: () => <strong className="fs-5">{'Author'}</strong>,
      },
      {
        field: 'year',
        renderHeader: () => <strong className="fs-5">{'Year'}</strong>,
      },
      {
        field: 'date_creation',
        renderCell: (params) => {
          const date = new Date(params.row.date_creation);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        },
        renderHeader: () => <strong className="fs-5">{'Created'}</strong>,
      },
      {
        field: 'consulted',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderHeader: () => <strong className="fs-5">{'Consulted'}</strong>,
        renderCell: (params) => <StatusIcon active={params.row.consulted} />,
      },
      {
        field: 'read_later',
        width: 120,
        align: 'center',
        headerAlign: 'center',
        renderHeader: () => <strong className="fs-5">{'Read later'}</strong>,
        renderCell: (params) => <StatusIcon active={params.row.read_later} />,
      },
      {
        field: 'liked',
        align: 'center',
        headerAlign: 'center',
        renderHeader: () => <strong className="fs-5">{'Liked'}</strong>,
        renderCell: (params) => (
          <span
            className={`inline-flex h-8 w-8 items-center justify-center ${
              params.row.liked ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-label={params.row.liked ? 'Liked' : 'Not liked'}
            title={params.row.liked ? 'Liked' : 'Not liked'}
          >
            <Heart size={18} fill={params.row.liked ? 'currentColor' : 'none'} aria-hidden="true" />
          </span>
        ),
      },
      {
        field: 'actions',
        width: 72,
        align: 'center',
        headerAlign: 'center',
        renderHeader: () => <strong className="fs-5">{'Edit'}</strong>,
        renderCell: (params) => <EditButton activeItem={params.row} />,
      },
    ],
    [isMdUp],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Articles" description="Manage your library and track your reading at a glance.">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{total} total</span>
        </div>
      </PageHeader>

      <div className="flex justify-end">
        <AddButton title={'Add article'} />
      </div>

      <div className="min-w-0 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <DataTable
          rows={articles}
          columns={COLUMNS}
          columnVisibilityModel={columnVisibilityModel}
          total={total}
          isFetching={isFetching}
          error={error}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
}
