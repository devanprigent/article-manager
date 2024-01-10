// Bibliothèques
import React from "react";
import { DataGrid } from '@mui/x-data-grid';

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
        width: 250,
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
        width: 70,
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

function Tableau({ data }) {
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid rows={data} columns={COLUMNS} getRowHeight={() => 'auto'} />
        </div>
    )
}

export default Tableau;