// Libraries
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import DataTable from "../Structure/DataTable";
import ButtonAdd from "../Buttons/ButtonAdd";
import ButtonDetails from "../Buttons/ButtonDetails";
import FormArticle from "../Forms/FormArticle";
import { getArticlesURL } from "../Tools/Urls";
import FetchData from "../Tools/FetchData";
import { Article } from "../Tools/Types";

/**
 * This component generates the Article page.
 */
function PageArticles() {
  const API_URL_ARTICLES: string = getArticlesURL();
  const { data, fetchData } = FetchData(API_URL_ARTICLES);
  const TITLE_ADD_FORM: string = "Ajout d'un article";
  const newArticle: Article = {
    id: 0,
    name: "",
    author: "",
    url: "",
    year: new Date().getFullYear(),
    summary: "",
    read: false,
    read_again: false,
    favorite: false,
    tags: [],
    date_creation: "",
    date_modification: "",
  };
  const COLUMNS: GridColDef[] = [
    {
      field: "titre",
      width: 450,
      renderHeader: () => <strong className="fs-5">{"Titre"}</strong>,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer">
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
      renderHeader: () => <strong className="fs-5">{"A relire"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.read_again} />
      ),
    },
    {
      field: "Favoris",
      renderHeader: () => <strong className="fs-5">{"Favoris"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.favorite} />
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col mx-16 space-y-4">
      <div className="flex flex-row justify-center">
        <ButtonAdd<Article>
          fetchData={fetchData}
          urlToFetch={API_URL_ARTICLES}
          FormComponent={FormArticle}
          title={TITLE_ADD_FORM}
          activeItem={newArticle}
        />
      </div>
      <div className="shadow bg-white rounded overflow-auto">
        <DataTable data={data} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default PageArticles;
