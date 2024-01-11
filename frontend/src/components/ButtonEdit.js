// Libraries
import React, { useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import FormArticle from "./FormArticle";

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function ButtonEdit({ fetchData, urlToRequest, activeItem }) {
    const [modalEdit, setModalEdit] = useState(false);

    function toggleModalEdit() {
        setModalEdit(!modalEdit);
    }

    function edit(item) {
        setModalEdit(!modalEdit);
        axios
            .patch(`${urlToRequest}${item.id}/`, item)
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
                className="btn bg-warning text-white float-end"
                onClick={toggleModalEdit}
            >
                {"Modifier"}
            </Button>

            <FormArticle
                isOpen={modalEdit}
                toggle={toggleModalEdit}
                onSave={edit}
                title={"Modification d'un article"}
                activeItem={activeItem}
            />
        </main>
    );
}

// Exportation
export default ButtonEdit;
