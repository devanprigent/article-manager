// Libraries
import React from "react";
import { GridColDef } from '@mui/x-data-grid';
import DataTable from "./DataTable";
import FetchData from "./FetchData";
import ButtonAdd from "./ButtonAdd";
import FormWebsite from "./FormWebsite";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";
import { getWebSitesURL } from "./Urls";

/**
 * This component generates the Tag page.
 */
function WebSites() {
    const API_URL_WEBSITES: string = getWebSitesURL();
    const { data, fetchData } = FetchData(API_URL_WEBSITES);
    const COLUMNS: GridColDef[] = [
        {
            field: 'image_url',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Logo'}
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
                    {'Site'}
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
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderHeader: () => (
                <strong className="fs-5">
                    {'Actions'}
                </strong>
            ),
            renderCell: (params) => (
                <div className="d-flex justify-content-between">
                    <ButtonEdit
                        fetchData={fetchData}
                        urlToRequest={API_URL_WEBSITES}
                        FormComponent={FormWebsite}
                        title={"Modification d'un site web"}
                        activeItem={params.row}
                    />
                    <ButtonDelete
                        fetchData={fetchData}
                        urlToRequest={API_URL_WEBSITES}
                        itemId={params.row.id}
                    />
                </div>
            ),
        }
    ];

    return (
        <div className="container my-4">
            <ButtonAdd
                fetchData={fetchData}
                urlToFetch={API_URL_WEBSITES}
                FormComponent={FormWebsite}
                title={"Ajout d'un site web"}
                activeItem={{
                    "nom": "",
                    "url": "",
                    "image_url": ""
                }}
            />
            <div className="shadow p-3 mb-5 bg-white rounded">
                <DataTable data={data} columns={COLUMNS} />
            </div>
        </div>
    );
}

// Exportation
export default WebSites;