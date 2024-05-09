// Libraries
import React, { useState, ChangeEvent } from "react";
import * as yup from "yup";
import { Input } from "reactstrap";
import CreatableSelect from "react-select/creatable";
import TagsForm from "./TagsForm";
import { buttonSize, buttonStyle } from "../Tools/Constants";
import { FormProps, Tag, Article } from "../Tools/Types";
import { useArticles } from "../../redux/selectors";
import PopupWrapper from "../Wrappers/PopupWrapper";
import RemoveButton from "../Buttons/RemoveButton";

const validationSchema = yup.object({
  title: yup.string().required(" "),
  author: yup.string().required(" "),
  url: yup.string().url(" ").required(" "),
  year: yup
    .date()
    .min(0, "Year must be greater than or equal to 0")
    .max(
      new Date().getFullYear(),
      "Year must be less than or equal to the current year"
    )
    .required(" "),
  summary: yup.string(),
  read: yup.boolean().required(" "),
  read_again: yup.boolean().required(" "),
  favorite: yup.boolean().required(" "),
});

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

/**
 * The goal of this component is to provide a modal form htmlFor adding or editing an article.
 */
function ArticleForm({
  isOpen,
  toggle,
  onSave,
  title,
  activeItem,
  showDeleteButton,
}: Readonly<FormProps>) {
  const currentYear = new Date().getFullYear();
  const [item, setItem] = useState(activeItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentArticles = useArticles();
  const authors = currentArticles
    .map((article: Article) => article.author)
    .filter(onlyUnique)
    .sort((a, b) => a.localeCompare(b));

  function handleTagChange(newTags: Tag[]): void {
    setItem((prevItem) => ({ ...prevItem, tags: newTags }));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    let { name, value } = e.currentTarget;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  }

  function handleCheckBoxChange(e: ChangeEvent<HTMLInputElement>): void {
    let { name, checked } = e.currentTarget;
    setItem((prevItem) => ({ ...prevItem, [name]: checked }));
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
        console.log(error);
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          console.log(err.path, err.message);
          if (err.path !== undefined) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      });
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="flex flex-col space-y-8 w-100">
        <h1 className="text-center text-red-600 font-bold text-xl">{title}</h1>
        <form>
          <div className="flex flex-col space-y-2">
            <div>
              <label htmlFor="title">
                <b>Title</b>
              </label>
              <Input
                type="text"
                placeholder="Title"
                name="title"
                value={item.title}
                onChange={handleChange}
                invalid={errors.title !== undefined && errors.title !== ""}
              />
              {errors.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-64">
                <label htmlFor="author">
                  <b>Author</b>
                </label>
                <CreatableSelect
                  name="author"
                  placeholder="Author"
                  onChange={handleAuthorsChange}
                  isClearable={false}
                  value={
                    item.author
                      ? { value: item.author, label: item.author }
                      : null
                  }
                  options={authors.map((author) => ({
                    value: author,
                    label: author,
                  }))}
                />
                {errors.author && (
                  <div className="error-message">{errors.author}</div>
                )}
              </div>
              <div>
                <label htmlFor="year">
                  <b>Year</b>
                </label>
                <Input
                  type="number"
                  name="year"
                  min={0}
                  max={currentYear}
                  placeholder="Year"
                  value={item.year}
                  onChange={handleChange}
                  invalid={errors.year !== undefined && errors.year !== ""}
                />
                {errors.year && (
                  <div className="error-message">{errors.year}</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="url">
                <b>Url</b>
              </label>
              <Input
                type="text"
                name="url"
                placeholder="Url"
                value={item.url}
                onChange={handleChange}
                invalid={errors.url !== undefined && errors.url !== ""}
              />
              {errors.url && <div className="error-message">{errors.url}</div>}
            </div>
            <div>
              <TagsForm
                onChange={handleTagChange}
                currentTags={activeItem.tags}
              />
            </div>
            <div className="flex flex-row space-x-4 justify-between px-4">
              <div>
                <label htmlFor="read">
                  <b>Consulted</b>
                </label>
                <br />
                <Input
                  type="checkbox"
                  name="read"
                  checked={item.read}
                  onChange={handleCheckBoxChange}
                />
                {errors.read && (
                  <div className="error-message">{errors.read}</div>
                )}
              </div>
              <div>
                <label htmlFor="read_again">
                  <b>Read again</b>
                </label>
                <br />
                <Input
                  type="checkbox"
                  name="read_again"
                  checked={item.read_again}
                  onChange={handleCheckBoxChange}
                />
                {errors.read_again && (
                  <div className="error-message">{errors.read_again}</div>
                )}
              </div>
              <div>
                <label htmlFor="favorite">
                  <b>Favorite</b>
                </label>
                <br />
                <Input
                  type="checkbox"
                  name="favorite"
                  checked={item.favorite}
                  onChange={handleCheckBoxChange}
                />
                {errors.favorite && (
                  <div className="error-message">{errors.favorite}</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="summary">
                <b>Summary</b>
              </label>
              <Input
                type="textarea"
                name="summary"
                value={item.summary}
                onChange={handleChange}
                invalid={errors.summary !== undefined && errors.summary !== ""}
              />
              {errors.summary && (
                <div className="error-message">{errors.summary}</div>
              )}
            </div>
          </div>
        </form>
        <div className="flex flex-col justify-content-center items-center">
          {showDeleteButton ? (
            <div className="w-full flex flex-row justify-between">
              <RemoveButton itemId={activeItem.id} />
              <button
                className="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded"
                onClick={() => validateForm()}
              >
                Enregistrer
              </button>
            </div>
          ) : (
            <button
              className={`${buttonStyle.success} ${buttonSize.medium}`}
              onClick={() => validateForm()}
            >
              Enregistrer
            </button>
          )}
        </div>
      </div>
    </PopupWrapper>
  );
}

// Exportation
export default ArticleForm;
