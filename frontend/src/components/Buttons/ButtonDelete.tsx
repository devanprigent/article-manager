// Libraries
import React, { useState } from "react";
import FormConfirmation from "../Forms/FormConfirmation";
import { useDispatch } from "react-redux";
import { proxy, requestTypes } from "../Tools/Proxy";
import { DELETE_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface ButtonDeleteProps {
  itemId: number;
}

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function ButtonDelete({ itemId }: Readonly<ButtonDeleteProps>) {
  const dispatch = useDispatch();
  const [modalRemove, setModalRemove] = useState(false);

  function toggleModalRemove() {
    setModalRemove(!modalRemove);
  }

  async function remove(itemId: number) {
    const { error, message } = await proxy(requestTypes.DELETE_ARTICLE, itemId);
    if (!error) {
      dispatch(DELETE_ARTICLE(itemId));
      dispatch(SET_NOTIFICATION(message, "success"));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "success"));
    toggleModalRemove();
  }

  return (
    <>
      <button
        className="bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded"
        onClick={toggleModalRemove}
      >
        Supprimer
      </button>

      <FormConfirmation
        isOpen={modalRemove}
        toggle={toggleModalRemove}
        onSave={() => remove(itemId)}
      />
    </>
  );
}

// Exportation
export default ButtonDelete;
