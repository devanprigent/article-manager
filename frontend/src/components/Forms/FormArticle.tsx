// Libraries
import React, { useState, ChangeEvent, FunctionComponent } from "react";
import * as yup from "yup";
import { Input } from "reactstrap";
import CreatableSelect from "react-select/creatable";
import Tags from "../Forms/FormTags";
import { FormProps, Tag, Article } from "../Tools/Types";
import { getArticlesURL } from "../Tools/Urls";
import FetchData from "../Tools/FetchData";
import PopupWrapper from "../Wrappers/PopupWrapper";
import ButtonDelete from "../Buttons/ButtonDelete";

const validationSchema = yup.object({
  name: yup.string().required(" "),
  author: yup.string().required(" "),
  url: yup.string().url(" ").required(" "),
  year: yup.date().required(" "),
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
const FormArticle: FunctionComponent<FormProps<Article>> = ({
  isOpen,
  toggle,
  onSave,
  title,
  activeItem,
}) => {
  const [item, setItem] = useState(activeItem);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const API_URL_ARTICLES: string = getArticlesURL();
  const { data } = FetchData(API_URL_ARTICLES);
  const authors = (data as Article[])
    .map((article: Article) => article.author)
    .filter(onlyUnique)
    .sort();

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
              <label htmlFor="name">
                <b>Title</b>
              </label>
              <Input
                type="text"
                placeholder="Title"
                name="name"
                value={item.name}
                onChange={handleChange}
                invalid={errors.name !== undefined && errors.name !== ""}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
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
                  value={{ value: item.author, label: item.author }}
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
                  type="text"
                  name="year"
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
              <Tags onChange={handleTagChange} currentTags={activeItem.tags} />
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
          <div className="w-full flex flex-row justify-between">
            <ButtonDelete
              fetchData={() => {}}
              urlToRequest={API_URL_ARTICLES}
              itemId={activeItem.id}
            />

            <button
              className="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded"
              onClick={() => validateForm()}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </PopupWrapper>
  );
};

// Exportation
export default FormArticle;
