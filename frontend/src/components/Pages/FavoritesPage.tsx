// Libraries
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
// Configuration Files
import { Article } from "../Tools/Types";
import { useArticles } from "../../redux/selectors";
// Components
import DataTable from "../Structure/DataTable";
import EditButton from "../Buttons/EditButton";

/**
 * This component generates the Tag page.
 */
function FavoritesPage() {
  const currentArticles = useArticles();
  const favoris = currentArticles.filter(
    (article: Article) => article.favorite === true
  );

  const COLUMNS: GridColDef[] = [
    {
      field: "title",
      width: 450,
      renderHeader: () => <strong className="fs-5">{"Title"}</strong>,
      renderCell: (params) => (
        <a
          href={params.row.url_article}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.row.title}
        </a>
      ),
    },
    {
      field: "author",
      width: 150,
      renderHeader: () => <strong className="fs-5">{"Author"}</strong>,
    },
    {
      field: "year",
      renderHeader: () => <strong className="fs-5">{"Year"}</strong>,
    },
    {
      field: "read",
      renderHeader: () => <strong className="fs-5">{"Read"}</strong>,
      renderCell: (params) => <Checkbox disabled checked={params.row.read} />,
    },
    {
      field: "read_again",
      width: 150,
      renderHeader: () => <strong className="fs-5">{"Read Again"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.read_again} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => <strong className="fs-5">{"Actions"}</strong>,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <EditButton activeItem={params.row} />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col justify-start mx-16">
      <div className="shadow bg-white rounded overflow-auto">
        <DataTable data={favoris} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default FavoritesPage;
