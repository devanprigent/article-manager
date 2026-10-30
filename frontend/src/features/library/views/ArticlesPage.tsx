import { useState } from 'react';

import { pageSize } from '../../../constants/constants';
import PageHeader from '../../../core/ui/PageHeader';
import { useArticles, useSearch } from '../../../hooks/queries';
import { useDebounce } from '../../../hooks/useDebounce';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import DataTable from '../components/DataTable';
import { getArticleColumns, getColumnVisibilityModel } from '../helpers/articleColumns';

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
  const columns = getArticleColumns(isMdUp);
  const columnVisibilityModel = getColumnVisibilityModel(isMdUp);

  return (
    <div className="space-y-5">
      <PageHeader title="Library" description="Manage your library and track your reading at a glance.">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            {total} total
          </span>
        </div>
      </PageHeader>

      <div className="min-w-0 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <DataTable
          rows={articles}
          columns={columns}
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
