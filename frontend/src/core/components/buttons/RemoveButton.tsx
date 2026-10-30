import { useState } from 'react';
import { Trash2 } from 'react-feather';

import { UseMutateFunction } from '@tanstack/react-query';

import ConfirmationForm from '../forms/ConfirmationForm';

interface PropsType {
  itemId: number;
  remove: UseMutateFunction<number, unknown, number[], unknown>;
  isPending: boolean;
  title: string;
}

export function RemoveButton({ itemId, remove, isPending, title }: Readonly<PropsType>) {
  const [modalRemove, setModalRemove] = useState(false);

  function toggleModalRemove() {
    setModalRemove(!modalRemove);
  }

  return (
    <>
      <button
        data-testid={`delete-item-${itemId}`}
        className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
        onClick={toggleModalRemove}
        disabled={isPending}
        aria-label={title}
        title={title}
      >
        <Trash2 size={18} strokeWidth={2.2} />
      </button>
      <ConfirmationForm
        title={title}
        isOpen={modalRemove}
        toggle={toggleModalRemove}
        isPending={isPending}
        onSave={() => remove([itemId], { onSuccess: () => setModalRemove(false) })}
      />
    </>
  );
}
