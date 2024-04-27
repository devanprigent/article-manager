// Libraries
import React, { useState, FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Item, FormProps, Article } from "../Tools/Types";
import { proxy, requestTypes } from "../Tools/Proxy";
import { ADD_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface ButtonAddProps<T extends Item> {
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
  FormComponent,
  title,
  activeItem,
}: Readonly<ButtonAddProps<T>>) {
  const dispatch = useDispatch();
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  async function create(item: T) {
    const { error, message } = await proxy(requestTypes.ADD_ARTICLE, item);
    if (!error) {
      const article = item as unknown as Article;
      dispatch(ADD_ARTICLE(article));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "success"));
    toggleModalCreate();
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
          showDeleteButton={false}
        />
      )}
    </>
  );
}

// Exportation
export default ButtonAdd;
