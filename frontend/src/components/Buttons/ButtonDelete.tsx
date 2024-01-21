// Libraries
import React, { useState } from "react";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import axios from "axios";
import FormConfirmation from "../Forms/FormConfirmation";

interface ButtonDeleteProps {
    fetchData: () => void;
    urlToRequest: string;
    itemId: number;
}

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function ButtonDelete({ fetchData, urlToRequest, itemId }: Readonly<ButtonDeleteProps>) {
    const [modalRemove, setModalRemove] = useState(false);

    function toggleModalRemove() {
        setModalRemove(!modalRemove);
    }

    function remove(itemId: number) {
        setModalRemove(!modalRemove);
        axios
            .delete(`${urlToRequest}${itemId}/`)
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <main>
            <button onClick={toggleModalRemove}>
                <DeleteRoundedIcon/>
            </button>

            <FormConfirmation
                isOpen={modalRemove}
                toggle={toggleModalRemove}
                onSave={() => remove(itemId)}
            />
        </main>
    );
}

// Exportation
export default ButtonDelete;
