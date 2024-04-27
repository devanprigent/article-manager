// Libraries
import React, { useState, FunctionComponent } from "react";
import axios from "axios";
import { Item, FormProps, Article } from "../Tools/Types";
import { useDispatch } from "react-redux";
import { ADD_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface ButtonAddProps<T extends Item> {
  fetchData: () => void;
  urlToFetch: string;
  FormComponent: FunctionComponent<FormProps<T>>;
  title: string;
  activeItem: T;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function ButtonAdd<T extends Item>({
  urlToFetch,
  FormComponent,
  title,
  activeItem,
}: Readonly<ButtonAddProps<T>>) {
  const dispatch = useDispatch();
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  function create(item: T) {
    toggleModalCreate();
    axios
      .post(urlToFetch, item)
      .then(() => {
        const article = item as unknown as Article;
        dispatch(ADD_ARTICLE(article));
        dispatch(SET_NOTIFICATION("An article has been added", "success"));
      })
      .catch((error) => {
        console.error(error);
        dispatch(SET_NOTIFICATION(error.response.data, "error"));
      });
  }

  return (
    <>
      <button
        className="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded"
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
        />
      )}
    </>
  );
}

// Exportation
export default ButtonAdd;
