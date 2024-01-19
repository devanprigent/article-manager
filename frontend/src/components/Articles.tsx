// Libraries
import React from "react";
import { GridColDef } from '@mui/x-data-grid';
import DataTable from "./DataTable";
import ButtonAdd from "./ButtonAdd";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";
import FetchData from "./FetchData";
import FormArticle from "./FormArticle";
import { getArticlesURL } from "./Urls";
import { Article, Tag } from "./Types";

/**
 * This component generates the Article page.
 */
function Articles() {
    const API_URL_ARTICLES: string = getArticlesURL();
    const { data, fetchData } = FetchData(API_URL_ARTICLES);
    const TITLE_ADD_FORM: string = "Ajout d'un article";
    const newArticle: Article = {
        "tags": [],
        "titre": "",
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
            width: 250,
            renderCell: (params) => (
                <a href={params.row.url_article} target="_blank" rel="noopener noreferrer">
                    {params.row.titre}
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
            width: 150,
        },
        {
            field: 'url_site',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Site'}
                </strong>
            ),
            width: 220,
            renderCell: (params) => (
                <a href={params.row.url_site} target="_blank" rel="noopener noreferrer">
                    {params.row.url_site}
                </a>
            ),
        },
        {
            field: 'date',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Date'}
                </strong>
            ),
            width: 80,
        },
        {
            field: 'synopsis',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Synopsis'}
                </strong>
            ),
            width: 400,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}>
                    {params.row.synopsis}
                </div>
            ),
        },
        {
            field: 'tags',
            renderHeader: () => (
                <strong className="fs-5">
                    {'Tags'}
                </strong>
            ),
            width: 150,
            renderCell: (params) => (
                params.value.map((tag: Tag) => (tag.nom)).join(', ')
            ),
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
                    <ButtonEdit<Article>
                        fetchData={fetchData}
                        urlToRequest={API_URL_ARTICLES}
                        FormComponent={FormArticle}
                        title={"Modification d'un article"}
                        activeItem={params.row}
                    />
                    <ButtonDelete
                        fetchData={fetchData}
                        urlToRequest={API_URL_ARTICLES}
                        itemId={params.row.id}
                    />
                </div>
            ),
        }
    ];

    return (
        <div className="container my-4">
            <ButtonAdd<Article>
                fetchData={fetchData}
                urlToFetch={API_URL_ARTICLES}
                FormComponent={FormArticle}
                title={TITLE_ADD_FORM}
                activeItem={newArticle}
            />
            <div className="mx-auto shadow p-3 mb-5 bg-white rounded">
                <DataTable data={data} columns={COLUMNS} />
            </div>
        </div>
    );
}

// Exportation
export default Articles;