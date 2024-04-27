// Libraries
import React, { useState } from "react";
import { Info } from "react-feather";
import { Article } from "../Tools/Types";
import FormArticle from "../Forms/FormArticle";
import { useDispatch } from "react-redux";
import { proxy, requestTypes } from "../Tools/Proxy";
import { EDIT_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface ButtonEditProps {
  activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function ButtonEdit({ activeItem }: Readonly<ButtonEditProps>) {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);

  function toggleModal() {
    setModal(!modal);
  }

  async function edit(article: Article) {
    const { error, message } = await proxy(requestTypes.EDIT_ARTICLE, article);
    if (!error) {
      dispatch(EDIT_ARTICLE(article.id, article));
      dispatch(SET_NOTIFICATION(message, "success"));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "success"));
    toggleModal();
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
          showDeleteButton={true}
        />
      )}
    </div>
  );
}

// Exportation
export default ButtonEdit;
