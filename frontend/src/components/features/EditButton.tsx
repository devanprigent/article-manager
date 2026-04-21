import { useState } from 'react';
import { Edit3 } from 'react-feather';
import { Article } from '../../constants/types';
import FormArticle from '../forms/ArticleForm';
import { useEditArticle } from '../../hooks/mutations';

interface PropsType {
  activeItem: Article;
}

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
