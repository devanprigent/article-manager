import { useState, type ChangeEvent } from 'react';
import * as yup from 'yup';
import { Input } from 'reactstrap';
import CreatableSelect from 'react-select/creatable';
import TagsForm from './TagsForm';
import { buttonSize, buttonStyle } from '../../constants/constants';
import { FormProps } from '../../constants/types';
import { useAuthors } from '../../hooks/queries';
import PopupWrapper from '../features/PopupWrapper';
import RemoveButton from '../features/RemoveButton';

const validationSchema = yup.object({
  title: yup.string().required(' '),
  author: yup.string().required(' '),
  url: yup.string().url(' ').required(' '),
  year: yup
    .date()
    .min(0, 'Year must be greater than or equal to 0')
    .max(new Date().getFullYear(), 'Year must be less than or equal to the current year')
    .required(' '),
  summary: yup.string(),
  read: yup.boolean().required(' '),
  read_again: yup.boolean().required(' '),
  favorite: yup.boolean().required(' '),
});

function ArticleForm({ isOpen, toggle, onSave, title, activeItem, showDeleteButton }: Readonly<FormProps>) {
  const currentYear = new Date().getFullYear();
  const [item, setItem] = useState(activeItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: authors = [] } = useAuthors();
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

  function handleAuthorsChange(newValue: any) {
    setItem((prevItem) => ({ ...prevItem, author: newValue.value }));
  }

  function validateForm() {
    validationSchema
      .validate(item, { abortEarly: false })
      .then(() => {
        onSave(item);
        toggle();
      })
      .catch((error: yup.ValidationError) => {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path !== undefined) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      });
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="article-form flex w-100 flex-col space-y-8">
        <h1 className="text-center text-3xl font-bold text-red-600 dark:text-red-400">{title}</h1>
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
                  value={item.author ? { value: item.author, label: item.author } : null}
                  options={authors.map((author) => ({
                    value: author.name,
                    label: author.name,
                  }))}
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
                invalid={errors.url !== undefined && errors.url !== ''}
              />
              {errors.url && <div className="text-sm text-red-500">{errors.url}</div>}
            </div>
            <div>
              <TagsForm onChange={handleTagChange} currentTags={activeItem.tags} />
            </div>
            <div className="checkbox-group flex flex-row justify-between space-x-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <label htmlFor="read" className="text-slate-800 dark:text-slate-100">
                  <b>Consulted</b>
                </label>
                <br />
                <Input type="checkbox" name="read" checked={item.read} onChange={handleFieldChange} className="h-4 w-4 accent-blue-500" />
                {errors.read && <div className="text-sm text-red-500">{errors.read}</div>}
              </div>
              <div>
                <label htmlFor="read_again" className="text-slate-800 dark:text-slate-100">
                  <b>Review</b>
                </label>
                <br />
                <Input type="checkbox" name="read_again" checked={item.read_again} onChange={handleFieldChange} className="h-4 w-4 accent-blue-500" />
                {errors.read_again && <div className="text-sm text-red-500">{errors.read_again}</div>}
              </div>
              <div>
                <label htmlFor="favorite" className="text-slate-800 dark:text-slate-100">
                  <b>Favorite</b>
                </label>
                <br />
                <Input type="checkbox" name="favorite" checked={item.favorite} onChange={handleFieldChange} className="h-4 w-4 accent-blue-500" />
                {errors.favorite && <div className="text-sm text-red-500">{errors.favorite}</div>}
              </div>
            </div>
            <div>
              <label htmlFor="summary" className="text-slate-800 dark:text-slate-100">
                <b>Summary</b>
              </label>
              <Input
                type="textarea"
                name="summary"
                value={item.summary}
                onChange={handleFieldChange}
                className={inputClassName}
                invalid={errors.summary !== undefined && errors.summary !== ''}
              />
              {errors.summary && <div className="text-sm text-red-500">{errors.summary}</div>}
            </div>
          </div>
        </form>
        <div className="grid w-full grid-cols-3 items-center">
          <div className="justify-self-start">{showDeleteButton && <RemoveButton itemId={activeItem.id} />}</div>
          <div className="justify-self-center">
            <button className={`${buttonStyle.success} ${buttonSize.medium}`} onClick={() => validateForm()}>
              Save
            </button>
          </div>
          <div />
        </div>
      </div>
    </PopupWrapper>
  );
}

// Exportation
export default ArticleForm;
