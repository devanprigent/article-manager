// Libraries
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../Structure/DataTable";
import FetchData from "../Tools/FetchData";
import ButtonAdd from "../Buttons/ButtonAdd";
import FormWebsite from "../Forms/FormWebsite";
import ButtonDelete from "../Buttons/ButtonDelete";
import { getWebSitesURL } from "../Tools/Urls";
import { WebSite } from "../Tools/Types";

/**
 * This component generates the Tag page.
 */
function WebSites() {
  const API_URL_WEBSITES: string = getWebSitesURL();
  const { data } = FetchData(API_URL_WEBSITES);
  const TITLE_WEBSITE_FORM: string = "Ajout d'un site web";
  const newWebSite: WebSite = {
    id: 0,
    name: "",
    url: "",
    image_url: "",
  };
  const COLUMNS: GridColDef[] = [
    {
      field: "image_url",
      renderHeader: () => <strong className="fs-5">{"Logo"}</strong>,
      width: 170,
      renderCell: (params) => (
        <img
          src={params.row.image_url}
          width="120"
          height="100"
          alt="Website logo"
        />
      ),
    },
    {
      field: "name",
      width: 210,
      renderHeader: () => <strong className="fs-5">{"Site"}</strong>,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer">
          {params.row.name}
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderHeader: () => <strong className="fs-5">{"Actions"}</strong>,
      renderCell: (params) => (
        <div className="d-flex justify-content-between">
          <ButtonDelete itemId={params.row.id} />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col items-center">
      <div className="h-full w-1/2">
        <div className="h-full flex flex-col space-y-4">
          <div className="flex flex-row justify-content-center">
            <ButtonAdd
              FormComponent={FormWebsite}
              title={TITLE_WEBSITE_FORM}
              activeItem={newWebSite}
            />
          </div>
          <div className="shadow bg-white rounded overflow-y-auto">
            <DataTable data={data} columns={COLUMNS} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportation
export default WebSites;
