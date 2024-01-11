// Bibliothèques
import React, { useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";

// Composants
import FormConfirmation from "./FormConfirmation";

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function ButtonDelete({ fetchData, urlToRequest, objectId }) {
    const [item, setItem] = useState(null);
    const [modalRemove, setModalRemove] = useState(false);

    function toggleModalRemove(item) {
        setItem(item);
        setModalRemove(!modalRemove);
    }

    function remove(objectId) {
        setModalRemove(!modalRemove);
        axios
            .delete(`${urlToRequest}${objectId}/`)
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <main>
            <Button
                className="btn bg-danger text-white float-end"
                onClick={toggleModalRemove}
            >
                {"Supprimer"}
            </Button>

            <FormConfirmation
                isOpen={modalRemove}
                toggle={toggleModalRemove}
                onSave={() => remove(objectId)}
                item={item}
            />
        </main>
    );
}

// Exportation
export default ButtonDelete;
