// Libraries
import React, { useState, FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { buttonSize, buttonStyle } from "../Tools/Constants";
import { FormProps, Article } from "../Tools/Types";
import { proxy, requestTypes } from "../Tools/Proxy";
import { ADD_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface PropsType {
  FormComponent: FunctionComponent<FormProps>;
  title: string;
  activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function AddButton({ FormComponent, title, activeItem }: Readonly<PropsType>) {
  const dispatch = useDispatch();
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  async function create(article: Article) {
    const { error, message, data } = await proxy(
      requestTypes.ADD_ARTICLE,
      article
    );
    if (!error) {
      dispatch(ADD_ARTICLE(data));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "success"));
    toggleModalCreate();
  }

  return (
    <>
      <button
        className={`${buttonStyle.success} ${buttonSize.medium}`}
        onClick={toggleModalCreate}
      >
        Ajouter
      </button>

      {modalCreate && (
        <FormComponent
          isOpen={modalCreate}
          toggle={toggleModalCreate}
          onSave={create}
          title={title}
          activeItem={activeItem}
          showDeleteButton={false}
        />
      )}
    </>
  );
}

// Exportation
export default AddButton;
