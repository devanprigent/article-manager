// Libraries
import { useState, type FunctionComponent } from 'react';
import { Plus } from 'react-feather';
import { FormProps, Article } from '../../constants/types';
import { useCreateArticle } from '../../hooks/mutations';

interface PropsType {
  FormComponent: FunctionComponent<FormProps>;
  title: string;
  activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function AddButton({ FormComponent, title, activeItem }: Readonly<PropsType>) {
  const { mutate: createArticle, isPending } = useCreateArticle();
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
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
