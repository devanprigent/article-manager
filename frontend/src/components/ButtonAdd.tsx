// Libraries
import React, { useState, FunctionComponent } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { Item, FormProps } from "./Types";

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
function ButtonAdd<T extends Item>({ fetchData, urlToFetch, FormComponent, title, activeItem }: Readonly<ButtonAddProps<T>>) {
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  function create(item: T) {
    toggleModalCreate();
    axios
      .post(urlToFetch, item)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="d-flex justify-content-end">
      <Button className="btn btn-success btn-lg mb-4" onClick={toggleModalCreate}>
        Ajouter
      </Button>

      {modalCreate && <FormComponent
        isOpen={modalCreate}
        toggle={toggleModalCreate}
        onSave={create}
        title={title}
        activeItem={activeItem}
      />}
    </div>
  );
}

// Exportation
export default ButtonAdd;
