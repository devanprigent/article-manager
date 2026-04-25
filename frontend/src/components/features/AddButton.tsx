import { useState, type FunctionComponent } from 'react';
import { Plus } from 'react-feather';
import { FormProps, Article } from '../../constants/types';
import { useCreateArticle } from '../../hooks/mutations';

interface PropsType {
  FormComponent: FunctionComponent<FormProps>;
  title: string;
  activeItem: Article;
}

function AddButton({ FormComponent, title, activeItem }: Readonly<PropsType>) {
  const { mutate: createArticle, isPending } = useCreateArticle();
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:opacity-90 dark:bg-emerald-900/40 dark:text-emerald-300"
        onClick={toggleModalCreate}
        disabled={isPending}
      >
        <Plus size={16} />
        Add
      </button>

      {modalCreate && (
        <FormComponent
          isOpen={modalCreate}
          toggle={toggleModalCreate}
          onSave={createArticle}
          title={title}
          activeItem={activeItem}
          showDeleteButton={false}
        />
      )}
    </>
  );
}

// Exportation
export default AddButton;
