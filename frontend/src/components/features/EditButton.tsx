// Libraries
import { useState } from 'react';
import { Edit3 } from 'react-feather';
import { Article } from '../../constants/types';
import FormArticle from '../forms/ArticleForm';
import { useEditArticle } from '../../hooks/mutations';

interface PropsType {
  activeItem: Article;
}

/***
 * The goal of this component is to provide a button to add an entity. The component takes
 * in a method named fetchData and a string named urlToFetch as props. The component triggers
 * a modal form and send the data in a POST request to the urlToFetch. Then it calls the callback
 * fetchData to update the datatable.
 */
function EditButton({ activeItem }: Readonly<PropsType>) {
  const { mutate: editArticle, isPending } = useEditArticle();
  const [modal, setModal] = useState<boolean>(false);

  function toggleModal() {
    setModal(!modal);
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={toggleModal}
        className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700"
        aria-label="Edit article"
        title="Edit article"
        disabled={isPending}
      >
        <Edit3 size={20} strokeWidth={2.2} />
      </button>

      {modal && (
        <FormArticle
          isOpen={modal}
          toggle={toggleModal}
          onSave={editArticle}
          title={'Article details'}
          activeItem={activeItem}
          showDeleteButton={true}
        />
      )}
    </div>
  );
}

// Exportation
export default EditButton;
