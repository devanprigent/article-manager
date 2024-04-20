// Libraries
import React, { useState } from "react";
import { Info } from "react-feather";
import { Article } from "../Tools/Types";
import FormDetailsArticle from "../Forms/FormDetailsArticle";

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
function ButtonDetails({
  fetchData,
  activeItem,
}: Readonly<ButtonDetailsProps>) {
  const [modal, setModal] = useState<boolean>(false);

  function toggleModal() {
    setModal(!modal);
  }

  return (
    <div className="d-flex justify-content-end">
      <Info
        onClick={toggleModal}
        size={"40px"}
        strokeWidth={"2px"}
        color={"#198754"}
      />

      {modal && (
        <FormDetailsArticle
          isOpen={modal}
          toggle={toggleModal}
          fetchData={fetchData}
          title={"Fiche de l'article"}
          activeItem={activeItem}
        />
      )}
    </div>
  );
}

// Exportation
export default ButtonDetails;
