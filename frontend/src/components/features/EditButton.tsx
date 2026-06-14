import { useState } from 'react';
import { Edit3 } from 'react-feather';

import { Article } from '../../constants/types';
import { useEditArticle } from '../../hooks/mutations';
import ArticleForm from '../forms/ArticleForm';

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
    <div className="flex justify-center">
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
        <ArticleForm
          isOpen={modal}
          toggle={toggleModal}
          onSave={(item: Article) => editArticle(item, { onSuccess: () => setModal(false) })}
          isPending={isPending}
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
