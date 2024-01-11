// Bibliothèques
import React from "react";
import DataTable from "./DataTable";
import ButtonAdd from "./ButtonAdd";
import FetchData from "./FetchData";
import { getArticlesURL } from "./Urls";

const COLUMNS = [
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
            params.value.map((tag) => (tag.nom)).join(', ')
        ),
    },
];

/**
 * This component generates the Article page.
 */
function Articles() {
    const API_URL_ARTICLES = getArticlesURL();
    const { data, fetchData } = FetchData(API_URL_ARTICLES);

    return (
        <div className="container my-4">
            <ButtonAdd fetchData={fetchData} urlToFetch={API_URL_ARTICLES} />
            <div className="mx-auto shadow p-3 mb-5 bg-white rounded">
                <DataTable data={data} columns={COLUMNS} />
            </div>
        </div>
    );
}

// Exportation
export default Articles;