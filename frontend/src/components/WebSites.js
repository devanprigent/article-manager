// Libraries
import React from "react";
import DataTable from "./DataTable";
import FetchData from "./FetchData";
import ButtonAdd from "./ButtonAdd";
import { getWebSitesURL } from "./Urls";

const COLUMNS = [
    {
        field: 'image_url',
        renderHeader: () => (
            <strong className="fs-5">
                {'Image'}
            </strong>
        ),
        width: 250,
        renderCell: (params) => <img src={params.row.image_url} width="120" height="100" alt="Website logo" />,
        flex: 1
    },
    {
        field: 'nom',
        renderHeader: () => (
            <strong className="fs-5">
                {'Nom'}
            </strong>
        ),
        width: 250,
        flex: 1
    },
    {
        field: 'url',
        renderHeader: () => (
            <strong className="fs-5">
                {'URL'}
            </strong>
        ),
        width: 250,
        renderCell: (params) => (
            <a href={params.row.url} target="_blank" rel="noopener noreferrer">
                {params.row.url}
            </a>
        ),
        flex: 1
    }
];

/**
 * This component generates the Tag page.
 */
function WebSites() {
    const API_URL_WEBSITES = getWebSitesURL();
    const { data, fetchData } = FetchData(API_URL_WEBSITES);

    return (
        <div className="container my-4">
            <ButtonAdd fetchData={fetchData} urlToFetch={API_URL_WEBSITES} />
            <div className="shadow p-3 mb-5 bg-white rounded">
                <DataTable data={data} columns={COLUMNS} />
            </div>
        </div>
    );
}

// Exportation
export default WebSites;