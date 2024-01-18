// Libraries
import React, { useState, FunctionComponent } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { Article } from "./Types";

interface AjoutProps {
  fetchData: () => void;
  urlToFetch: string;
  FormComponent: FunctionComponent;
  title: string;
  activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes 
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function Ajout({ fetchData, urlToFetch, FormComponent, title, activeItem }: AjoutProps) {
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  function create(item: Article) {
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
      <Button className="btn btn-success mb-3" onClick={toggleModalCreate}>
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
export default Ajout;
