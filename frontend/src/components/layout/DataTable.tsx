import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Article } from '../../constants/types';
import { useIsDarkMode } from '../../contexts/ThemeContext';

interface TableauProps {
  data: Article[];
  columns: GridColDef[];
}

function DataTable({ data, columns }: Readonly<TableauProps>) {
  const isDarkMode = useIsDarkMode();

  return (
    <div className="bg-white dark:bg-slate-900">
      <DataGrid
        className="app-data-grid"
        rows={data}
        columns={columns}
        autoHeight
        getRowHeight={() => 'auto'}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: false },
            csvOptions: { disableToolbarButton: true },
            showQuickFilter: true,
          },
        }}
        hideFooter
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
      />
    </div>
  );
}

// Exportation
export default DataTable;
