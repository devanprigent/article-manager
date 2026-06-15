import { useCallback } from 'react';

import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';

import { pageSize } from '../../constants/constants';
import { Article } from '../../constants/types';
import { useIsDarkMode } from '../../contexts/ThemeContext';
import { ErrorMessage } from '../features/ErrorMessage';

interface DataTableProps {
  rows: Article[];
  columns: GridColDef[];
  isFetching: boolean;
  error: Error | null;
  total: number;
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function DataTable({ rows, columns, isFetching, error, total, paginationModel, setPaginationModel, setSearch }: Readonly<DataTableProps>) {
  const isDarkMode = useIsDarkMode();

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    setSearch(filterModel?.quickFilterValues?.[0] || '');
    setPaginationModel({ page: 0, pageSize: pageSize });
  }, []);

  if (error) {
    return ErrorMessage(error.message);
  }

  return (
    <div className="bg-white dark:bg-slate-900">
      <DataGrid
        className="app-data-grid"
        rows={rows}
        columns={columns}
        loading={isFetching}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={total}
        pageSizeOptions={[25]}
        autoHeight
        getRowHeight={() => 'auto'}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{
          border: 0,
          ...(isDarkMode && {
            '--DataGrid-t-header-background-base': '#1e293b',
            '--DataGrid-t-cell-background-base': '#0f172a',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            '& .MuiDataGrid-main, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-virtualScrollerContent, & .MuiDataGrid-virtualScrollerContent--overflowed, & .MuiDataGrid-overlay, & .MuiDataGrid-filler, & .MuiDataGrid-topContainer, & .MuiDataGrid-bottomContainer':
              {
                backgroundColor: '#0f172a',
              },
          }),
        }}
        showToolbar
      />
    </div>
  );
}

// Exportation
export default DataTable;
