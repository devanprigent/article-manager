// Libraries
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Article } from "../Tools/Types";

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
    <div className="flex-grow h-full bg-gray-100 border">
      <DataGrid
        rows={data}
        columns={columns}
        getRowHeight={() => "auto"}
        hideFooter
      />
    </div>
  );
}

// Exportation
export default DataTable;
