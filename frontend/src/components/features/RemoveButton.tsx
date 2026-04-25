import { useState } from 'react';
import { Trash2 } from 'react-feather';
import ConfirmationForm from '../forms/ConfirmationForm';
import { useRemoveArticle } from '../../hooks/mutations';

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
      <button
        className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
        onClick={toggleModalRemove}
        disabled={isPending}
        aria-label="Delete article"
        title="Delete article"
      >
        <Trash2 size={18} strokeWidth={2.2} />
      </button>
      <ConfirmationForm isOpen={modalRemove} toggle={toggleModalRemove} onSave={() => remove([itemId])} />
    </>
  );
}

// Exportation
export default RemoveButton;
