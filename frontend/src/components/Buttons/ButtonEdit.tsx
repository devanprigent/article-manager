// Libraries
import React, { useState, FunctionComponent } from "react";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { FormProps, Item } from "../Tools/Types";

interface ButtonEditProps<T extends Item> {
    fetchData: () => void;
    urlToRequest: string;
    FormComponent: FunctionComponent<FormProps<T>>;
    title: string;
    activeItem: T;
}

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function ButtonEdit<T extends Item>({ fetchData, urlToRequest, FormComponent, title, activeItem }: Readonly<ButtonEditProps<T>>) {
    const [modalEdit, setModalEdit] = useState(false);

    function toggleModalEdit() {
        setModalEdit(!modalEdit);
    }

    function edit(item: T) {
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
            <button onClick={toggleModalEdit}>
                <EditIcon/>
            </button>

            <FormComponent
                isOpen={modalEdit}
                toggle={toggleModalEdit}
                onSave={edit}
                title={title}
                activeItem={activeItem}
            />
        </main>
    );
}

// Exportation
export default ButtonEdit;
