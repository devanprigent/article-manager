// Libraries
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import DataTable from "../Structure/DataTable";
import ButtonDetails from "../Buttons/ButtonDetails";
import FetchData from "../Tools/FetchData";
import { getArticlesURL } from "../Tools/Urls";
import { Article } from "../Tools/Types";

/**
 * This component generates the Tag page.
 */
function Favoris() {
  const API_URL_ARTICLES: string = getArticlesURL();
  const { data, fetchData } = FetchData(API_URL_ARTICLES);
  const typedData = data as Article[];
  const favoris = typedData.filter(
    (article: Article) => article.favoris === true
  );

  const COLUMNS: GridColDef[] = [
    {
      field: "titre",
      width: 450,
      renderHeader: () => <strong className="fs-5">{"Titre"}</strong>,
      renderCell: (params) => (
        <a
          href={params.row.url_article}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.row.nom}
        </a>
      ),
    },
    {
      field: "auteur",
      width: 150,
      renderHeader: () => <strong className="fs-5">{"Auteur"}</strong>,
    },
    {
      field: "date",
      renderHeader: () => <strong className="fs-5">{"Date"}</strong>,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => <strong className="fs-5">{"Actions"}</strong>,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <ButtonDetails fetchData={fetchData} activeItem={params.row} />
        </div>
      ),
    },
    {
      field: "Lu",
      renderHeader: () => <strong className="fs-5">{"Consulté"}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.read} />,
    },
    {
      field: "Favoris",
      renderHeader: () => <strong className="fs-5">{"Favoris"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.favoris} />
      ),
    },
  ];

  return (
    <div className="container my-4">
      <div className="shadow p-3 mb-5 bg-white rounded">
        <DataTable data={favoris} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default Favoris;
