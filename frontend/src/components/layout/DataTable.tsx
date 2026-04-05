// Libraries
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Article } from "../../constants/types";

interface TableauProps {
  data: Article[];
  columns: GridColDef[];
}

/***
 * The goal of this component is to render a data grid using the DataGrid component
 * from the Material-UI library. The component takes in data and columns as props,
 * which represent the rows and columns of the data grid, respectively.
 */
function DataTable({ data, columns }: Readonly<TableauProps>) {
  return (
    <div className="min-h-[420px] bg-white">
      <DataGrid
        rows={data}
        columns={columns}
        getRowHeight={() => "auto"}
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
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "#334155",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8fafc",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f1f5f9",
            py: 1,
          },
          "& .MuiDataGrid-toolbarContainer": {
            borderBottom: "1px solid #e2e8f0",
            padding: "0.5rem 0.75rem",
            backgroundColor: "#ffffff",
          },
        }}
      />
    </div>
  );
}

// Exportation
export default DataTable;
