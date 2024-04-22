// Libraries
import React, { useState } from "react";
import { Info } from "react-feather";
import axios from "axios";
import { Article } from "../Tools/Types";
import FormArticle from "../Forms/FormArticle";
import { getArticlesURL } from "../Tools/Urls";

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
  const API_URL_ARTICLES: string = getArticlesURL();

  function toggleModal() {
    setModal(!modal);
  }

  function edit(article: Article) {
    toggleModal();
    axios
      .patch(`${API_URL_ARTICLES}${article.id}/`, article)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
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
        <FormArticle
          isOpen={modal}
          toggle={toggleModal}
          onSave={edit}
          title={"Fiche de l'article"}
          activeItem={activeItem}
        />
      )}
    </div>
  );
}

// Exportation
export default ButtonDetails;
