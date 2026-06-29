import { useState } from 'react';
import { Loader, Plus } from 'react-feather';

import { Article, ParsedMetadata } from '../../constants/types';
import { parseYear } from '../../helpers/helpers';
import { useCreateArticle, useParsing } from '../../hooks/mutations';
import ArticleForm from '../forms/ArticleForm';
import UrlForm from '../forms/UrlForm';

interface PropsType {
  title: string;
}

const newMetadata: ParsedMetadata = {
  title: '',
  author: '',
  url: '',
  date: '',
};

const newArticle: Article = {
  id: 0,
  title: '',
  author: '',
  url: '',
  year: new Date().getFullYear(),
  summary: '',
  consulted: false,
  read_later: false,
  liked: false,
  tags: [],
  date_creation: '',
  date_modification: '',
  content: [],
};

function AddButton({ title }: Readonly<PropsType>) {
  const [metadata, setMetadata] = useState({ title: '', author: '', date: '', url: '' });
  const { mutate: parseArticle, isPending: isParsingPending } = useParsing();
  const { mutate: createArticle, isPending: isCreationPending } = useCreateArticle();
  const [modalParse, setModalParse] = useState<boolean>(false);
  const [modalCreate, setModalCreate] = useState<boolean>(false);

  function toggleModalParse() {
    setModalParse(!modalParse);
  }

  function toggleModalCreate() {
    setModalCreate(!modalCreate);
  }

  function onParsingDone(url: string) {
    parseArticle(url, {
      onSuccess: (data) => {
        setMetadata(data);
        setModalParse(false);
        setModalCreate(true);
      },
      onError() {
        setMetadata(newMetadata);
        setModalParse(false);
        setModalCreate(true);
      },
    });
  }

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:opacity-90 dark:bg-emerald-900/40 dark:text-emerald-300"
        onClick={toggleModalParse}
        disabled={isParsingPending || isCreationPending}
      >
        <Plus size={16} />
        Add
      </button>

      {modalParse && <UrlForm isOpen={modalParse} toggle={toggleModalParse} onSave={onParsingDone} title={title} showDeleteButton={false} />}
      {isParsingPending && (
        <div
          className="fixed inset-0 z-[1400] flex flex-col items-center justify-center gap-2 bg-black/40"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader className="animate-spin text-white" size={32} aria-hidden="true" />
          <span className="text-sm font-medium text-white">Parsing article…</span>
        </div>
      )}
      {modalCreate && (
        <ArticleForm
          mode="create"
          activeItem={{ ...newArticle, title: metadata.title, author: metadata.author, url: metadata.url, year: parseYear(metadata.date) }}
          isOpen={modalCreate}
          toggle={toggleModalCreate}
          onSave={(item: Article) => createArticle(item, { onSuccess: () => setModalCreate(false) })}
          isPending={isCreationPending}
          title={title}
          showDeleteButton={false}
        />
      )}
    </>
  );
}

// Exportation
export default AddButton;
