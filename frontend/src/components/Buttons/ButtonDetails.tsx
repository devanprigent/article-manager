// Libraries
import React, { useState } from "react";
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import { Article } from "../Tools/Types";
import DetailsArticle from "../Pages/DetailsArticle";

interface ButtonDetailsProps {
    fetchData: () => void;
    activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes 
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function ButtonDetails({ fetchData, activeItem }: Readonly<ButtonDetailsProps>) {
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  return (
    <div className="d-flex justify-content-end">
      <button onClick={toggleModalCreate}>
        <InfoSharpIcon/>
      </button>
      
      {modalCreate && <DetailsArticle
        isOpen={modalCreate}
        toggle={toggleModalCreate}
        fetchData={fetchData}
        title={"Fiche de l'article"}
        activeItem={activeItem}
      />}
    </div>
  );
}

// Exportation
export default ButtonDetails;
