// Libraries
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Article, WebSite } from "../Tools/Types";

interface TableauProps {
  data: Article[] | WebSite[];
  columns: GridColDef[];
}

/***
 * The goal of this component is to render a data grid using the DataGrid component
 * from the Material-UI library. The component takes in data and columns as props,
 * which represent the rows and columns of the data grid, respectively.
 */
function Tableau({ data, columns }: Readonly<TableauProps>) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowHeight={() => "auto"}
      hideFooter
    />
  );
}

// Exportation
export default Tableau;
