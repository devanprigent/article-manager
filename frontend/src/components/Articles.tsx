// Libraries
import React from "react";
import { GridColDef } from '@mui/x-data-grid';
import DataTable from "./DataTable";
import ButtonAdd from "./ButtonAdd";
import ButtonDetails from "./ButtonDetails";
import FetchData from "./FetchData";
import FormArticle from "./FormArticle";
import { getArticlesURL } from "./Urls";
import { Article } from "./Types";

/**
 * This component generates the Article page.
 */
function Articles() {
    const API_URL_ARTICLES: string = getArticlesURL();
    const { data, fetchData } = FetchData(API_URL_ARTICLES);
    const TITLE_ADD_FORM: string = "Ajout d'un article";
    const newArticle: Article = {
        "id": 0,
        "tags": [],
        "nom": "",
        "auteur": "",
        "url_site": "",
        "url_article": "",
        "date": 0,
        "synopsis": "",
        "date_creation": "",
        "date_modification": ""
    };
    const COLUMNS: GridColDef[] = [
        {
            field: 'titre',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Titre'}
                </strong>
            ),
            width: 320,
            renderCell: (params) => (
                <a href={params.row.url_article} target="_blank" rel="noopener noreferrer">
                    {params.row.nom}
                </a>
            ),
        },
        {
            field: 'auteur',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Auteur'}
                </strong>
            ),
            width: 170,
        },
        {
            field: 'date',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Date'}
                </strong>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Actions'}
                </strong>
            ),
            renderCell: (params) => (
                <div className="d-flex justify-content-center align-items-center">
                    <ButtonDetails
                        fetchData={fetchData}
                        activeItem={params.row}
                    />
                </div>
            ),
        }
    ];

    return (
        <div className="container my-4">
            <div className="col-md-12">
                <div className="d-flex justify-content-center">
                    <ButtonAdd<Article>
                         fetchData={fetchData}
                        urlToFetch={API_URL_ARTICLES}
                         FormComponent={FormArticle}
                        title={TITLE_ADD_FORM}
                        activeItem={newArticle}
                    />
                </div>
            </div>
                <div className="col-md-8 mx-auto">
                    <div className="mx-auto shadow p-3 mb-5 bg-white rounded">
                        <DataTable data={data} columns={COLUMNS} />
                    </div>
            </div>
        </div>
    );
}

// Exportation
export default Articles;