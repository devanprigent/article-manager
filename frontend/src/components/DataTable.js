// Bibliothèques
import React from "react";
import { DataGrid } from '@mui/x-data-grid';

/***
 * The goal of this component is to render a data grid using the DataGrid component 
 * from the Material-UI library. The component takes in data and columns as props, 
 * which represent the rows and columns of the data grid, respectively.
 */
function Tableau({ data, columns }) {
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={data} columns={columns} getRowHeight={() => 'auto'} hideFooter />
        </div>
    )
}

// Exportation
export default Tableau;