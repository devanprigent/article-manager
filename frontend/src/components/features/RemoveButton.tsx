import { useState } from 'react';
import ConfirmationForm from '../forms/ConfirmationForm';
import { useRemoveArticle } from '../../hooks/mutations';
import { buttonSize, buttonStyle } from '../../constants/constants';

interface PropsType {
  itemId: number;
}

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
