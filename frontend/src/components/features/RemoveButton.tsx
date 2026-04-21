// Libraries
import { useState } from 'react';
import ConfirmationForm from '../forms/ConfirmationForm';
import { useRemoveArticle } from '../../hooks/mutations';
import { buttonSize, buttonStyle } from '../../constants/constants';

interface PropsType {
  itemId: number;
}

/**
 * The role of this component is to handle the deletion of an item.
 * It displays a "Delete" button that, when clicked, opens a confirmation form.
 * When the confirmation window is confirmed, a DELETE request is sent to the API.
 */
function RemoveButton({ itemId }: Readonly<PropsType>) {
  const { mutate: remove, isPending } = useRemoveArticle();
  const [modalRemove, setModalRemove] = useState(false);

  function toggleModalRemove() {
    setModalRemove(!modalRemove);
  }

  return (
    <>
      <button className={`${buttonStyle.error} ${buttonSize.medium}`} onClick={toggleModalRemove} disabled={isPending}>
        Delete
      </button>

      <ConfirmationForm isOpen={modalRemove} toggle={toggleModalRemove} onSave={() => remove(itemId)} />
    </>
  );
}

// Exportation
export default RemoveButton;
