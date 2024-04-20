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
function PageFavoris() {
  const API_URL_ARTICLES: string = getArticlesURL();
  const { data, fetchData } = FetchData(API_URL_ARTICLES);
  const typedData = data as Article[];
  const favoris = typedData.filter(
    (article: Article) => article.favorite === true
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
          {params.row.name}
        </a>
      ),
    },
    {
      field: "author",
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
      field: "read",
      renderHeader: () => <strong className="fs-5">{"Consulté"}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.read} />,
    },
    {
      field: "read_again",
      renderHeader: () => <strong className="fs-5">{"Consulté"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.read_again} />
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col mx-16 space-y-4">
      <div className="shadow bg-white rounded overflow-auto">
        <DataTable data={favoris} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default PageFavoris;
