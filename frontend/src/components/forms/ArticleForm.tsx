import { useState, type ChangeEvent } from 'react';
import { Heart } from 'react-feather';
import type { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Input } from 'reactstrap';

import { buttonSize, buttonStyle } from '../../constants/constants';
import { ArticleSchema } from '../../constants/schema';
import { ArticleFormProps } from '../../constants/types';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuthors } from '../../hooks/queries';
import PopupWrapper from '../features/PopupWrapper';
import RemoveButton from '../features/RemoveButton';
import TagsForm from './TagsForm';

type AuthorOption = { value: string; label: string };

function ArticleForm({ isOpen, toggle, onSave, title, activeItem, showDeleteButton, isPending = false }: Readonly<ArticleFormProps>) {
  const currentYear = new Date().getFullYear();
  const [item, setItem] = useState(activeItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: authors = [] } = useAuthors();
  const { requireSummaryOnSave } = useSettings();
  const authorOptions: AuthorOption[] = authors.map((author) => ({ value: author, label: author }));
  const selectedAuthor = authorOptions.find((option) => option.value === item.author) ?? { value: item.author, label: item.author };
  const inputClassName =
    'border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400';

  function handleFieldChange(e: ChangeEvent<HTMLInputElement>): void {
    const el = e.currentTarget;
    const patch = el.type === 'checkbox' ? { [el.name]: el.checked } : { [el.name]: el.name === 'year' ? Number(el.value) : el.value };
    setItem((prev) => ({ ...prev, ...patch }));
  }

  function handleTagChange(newTags: string[]): void {
    setItem((prevItem) => ({ ...prevItem, tags: newTags }));
  }

  function handleAuthorsChange(newValue: SingleValue<AuthorOption>) {
    setItem((prevItem) => ({ ...prevItem, author: newValue?.value ?? '' }));
  }

  function handleLikedToggle(): void {
    setItem((prevItem) => ({ ...prevItem, liked: !prevItem.liked }));
  }

  function validateForm() {
    const result = ArticleSchema.safeParse(item);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string' && newErrors[key] === undefined) {
          newErrors[key] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    if (requireSummaryOnSave && item.consulted && item.summary?.trim() === '') {
      setErrors({ summary: 'Summary is required' });
      return;
    }

    setErrors({});
    onSave(item);
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="article-form flex w-100 flex-col space-y-8">
        <div className="flex items-start justify-between">
          <div className="w-8" />
          <h1 className="text-center text-3xl font-bold dark:text-white">{title}</h1>
          <div className="w-8 text-right">{showDeleteButton && <RemoveButton itemId={activeItem.id} />}</div>
        </div>
        <form>
          <div className="flex flex-col space-y-2 text-slate-800 dark:text-slate-100">
            <div>
              <label htmlFor="title" className="text-slate-800 dark:text-slate-100">
                <b>Title</b>
              </label>
              <Input
                type="text"
                placeholder="Title"
                name="title"
                value={item.title}
                onChange={handleFieldChange}
                className={inputClassName}
                invalid={errors.title !== undefined && errors.title !== ''}
              />
              {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-64">
                <label htmlFor="author" className="text-slate-800 dark:text-slate-100">
                  <b>Author</b>
                </label>
                <CreatableSelect
                  classNamePrefix="author-select"
                  name="author"
                  placeholder="Author"
                  onChange={handleAuthorsChange}
                  isClearable={false}
                  value={selectedAuthor}
                  options={authorOptions}
                />
                {errors.author && <div className="text-sm text-red-500">{errors.author}</div>}
              </div>
              <div>
                <label htmlFor="year" className="text-slate-800 dark:text-slate-100">
                  <b>Year</b>
                </label>
                <Input
                  type="number"
                  name="year"
                  min={0}
                  max={currentYear}
                  placeholder="Year"
                  value={item.year}
                  onChange={handleFieldChange}
                  className={inputClassName}
                  invalid={errors.year !== undefined && errors.year !== ''}
                />
                {errors.year && <div className="text-sm text-red-500">{errors.year}</div>}
              </div>
            </div>
            <div>
              <label htmlFor="url" className="text-slate-800 dark:text-slate-100">
                <b>Url</b>
              </label>
              <Input
                type="text"
                name="url"
                placeholder="Url"
                value={item.url}
                onChange={handleFieldChange}
                className={inputClassName}
                autoComplete="off"
                invalid={errors.url !== undefined && errors.url !== ''}
              />
              {errors.url && <div className="text-sm text-red-500">{errors.url}</div>}
            </div>
            <div>
              <TagsForm onChange={handleTagChange} currentTags={activeItem.tags} />
            </div>
            <div className="checkbox-group flex flex-row justify-between space-x-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <label htmlFor="consulted" className="text-slate-800 dark:text-slate-100">
                  <b>Consulted</b>
                </label>
                <br />
                <Input type="checkbox" name="consulted" checked={item.consulted} onChange={handleFieldChange} className="h-4 w-4 accent-blue-500" />
                {errors.consulted && <div className="text-sm text-red-500">{errors.consulted}</div>}
              </div>
              <div>
                <label htmlFor="read_later" className="text-slate-800 dark:text-slate-100">
                  <b>Read later</b>
                </label>
                <br />
                <Input type="checkbox" name="read_later" checked={item.read_later} onChange={handleFieldChange} className="h-4 w-4 accent-blue-500" />
                {errors.read_later && <div className="text-sm text-red-500">{errors.read_later}</div>}
              </div>
              <div>
                <label htmlFor="liked" className="text-slate-800 dark:text-slate-100">
                  <b>Liked</b>
                </label>
                <br />
                <button
                  type="button"
                  aria-pressed={item.liked}
                  aria-label={item.liked ? 'Remove like' : 'Add like'}
                  title={item.liked ? 'Liked' : 'Not liked'}
                  onClick={handleLikedToggle}
                  className={`inline-flex h-6 w-6 items-center justify-center transition ${
                    item.liked ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Heart size={18} fill={item.liked ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
                {errors.liked && <div className="text-sm text-red-500">{errors.liked}</div>}
              </div>
            </div>
            <div>
              <label htmlFor="summary" className="text-slate-800 dark:text-slate-100">
                <b>Summary{requireSummaryOnSave ? ' *' : ''}</b>
              </label>
              <Input
                type="textarea"
                name="summary"
                value={item.summary || ''}
                onChange={handleFieldChange}
                className={inputClassName}
                invalid={errors.summary !== undefined && errors.summary !== ''}
              />
              {errors.summary && <div className="text-sm text-red-500">{errors.summary}</div>}
            </div>
          </div>
        </form>
        <div className="flex w-full justify-center">
          <button type="button" className={`${buttonStyle.success} ${buttonSize.medium}`} onClick={() => validateForm()} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

// Exportation
export default ArticleForm;
