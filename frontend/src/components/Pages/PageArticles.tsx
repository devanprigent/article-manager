// Libraries
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { GridColDef } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
// Configuration Files
import { Article } from "../Tools/Types";
import { useArticles } from "../../redux/selectors";
import { proxy, requestTypes } from "../Tools/Proxy";
import { SET_ARTICLES, SET_NOTIFICATION } from "../../redux/actionsCreators";
// Components
import ButtonAdd from "../Buttons/ButtonAdd";
import DataTable from "../Structure/DataTable";
import ButtonEdit from "../Buttons/ButtonEdit";
import FormArticle from "../Forms/FormArticle";

/**
 * This component generates the Article page.
 */
function PageArticles() {
  const dispatch = useDispatch();
  const currentArticles = useArticles();

  useEffect(() => {
    async function fetchData() {
      const { error, message, data } = await proxy(requestTypes.FETCH_ARTICLES);
      if (!error) {
        const articles = data as Article[];
        dispatch(SET_ARTICLES(articles));
        return;
      }
      dispatch(SET_NOTIFICATION(message, "error"));
    }

    fetchData().catch((err) => console.error(err));
  }, [dispatch]);

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
      renderHeader: () => <strong className="fs-5">{"Title"}</strong>,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer">
          {params.row.name}
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
      field: "favorite",
      renderHeader: () => <strong className="fs-5">{"Favorite"}</strong>,
      renderCell: (params) => (
        <Checkbox disabled checked={params.row.favorite} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => <strong className="fs-5">{"Actions"}</strong>,
      renderCell: (params) => (
        <div className="d-flex justify-content-center align-items-center">
          <ButtonEdit activeItem={params.row} />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col mx-16 space-y-4">
      <div className="flex flex-row justify-center">
        <ButtonAdd<Article>
          FormComponent={FormArticle}
          title={TITLE_ADD_FORM}
          activeItem={newArticle}
        />
      </div>
      <div className="shadow bg-white rounded overflow-auto">
        <DataTable data={currentArticles} columns={COLUMNS} />
      </div>
    </div>
  );
}

// Exportation
export default PageArticles;
