// Libraries
import React, { useState } from "react";
import ConfirmationForm from "../Forms/ConfirmationForm";
import { useDispatch } from "react-redux";
import { proxy, requestTypes } from "../Tools/Proxy";
import { buttonSize, buttonStyle } from "../Tools/Constants";
import { DELETE_ARTICLE, SET_NOTIFICATION } from "../../redux/actionsCreators";

interface PropsType {
  itemId: number;
}

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function DeleteButton({ itemId }: Readonly<PropsType>) {
  const dispatch = useDispatch();
  const [modalRemove, setModalRemove] = useState(false);

  function toggleModalRemove() {
    setModalRemove(!modalRemove);
  }

  async function remove(itemId: number) {
    const { error, message } = await proxy(requestTypes.DELETE_ARTICLE, itemId);
    if (!error) {
      dispatch(DELETE_ARTICLE(itemId));
    }
    dispatch(SET_NOTIFICATION(message, error ? "error" : "warning"));
    toggleModalRemove();
  }

  return (
    <>
      <button
        className={`${buttonStyle.error} ${buttonSize.medium}`}
        onClick={toggleModalRemove}
      >
        Supprimer
      </button>

      <ConfirmationForm
        isOpen={modalRemove}
        toggle={toggleModalRemove}
        onSave={() => remove(itemId)}
      />
    </>
  );
}

// Exportation
export default DeleteButton;
