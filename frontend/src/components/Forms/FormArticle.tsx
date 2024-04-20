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

const validationSchema = yup.object({
  name: yup.string().required(" "),
  auteur: yup.string().required(" "),
  url_site: yup.string().url(" ").required(" "),
  url_article: yup.string().url(" ").required(" "),
  date: yup.date().required(" "),
  summary: yup.string(),
  read: yup.boolean().required(" "),
  favoris: yup.boolean().required(" "),
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
    let { name, type, value } = e.currentTarget;
    if (type === "checkbox") {
      value = e.currentTarget.checked ? "true" : "false";
    }
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  }

  function handleAuthorsChange(newValue: any) {
    setItem((prevItem) => ({ ...prevItem, auteur: newValue.value }));
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
          if (err.path !== undefined) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      });
  }

  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="flex flex-col space-y-4">
        <h1 className="text-center text-red-600 font-bold text-2xl">{title}</h1>
        <form>
          <div className="flex flex-col space-y-2">
            <div>
              <label htmlFor="name">
                <b>Titre</b>
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Titre"
                value={item.name}
                onChange={handleChange}
                invalid={errors.name !== undefined && errors.name !== ""}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="auteur">
                  <b>Auteur</b>
                </label>
                <CreatableSelect
                  name="auteur"
                  placeholder="Auteur"
                  onChange={handleAuthorsChange}
                  isClearable
                  options={authors.map((author) => ({
                    value: author,
                    label: author,
                  }))}
                />
                {errors.auteur && (
                  <div className="error-message">{errors.auteur}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="date">
                  <b>Année</b>
                </label>
                <Input
                  type="text"
                  name="date"
                  placeholder="Année"
                  value={item.date}
                  onChange={handleChange}
                  invalid={errors.date !== undefined && errors.date !== ""}
                />
                {errors.date && (
                  <div className="error-message">{errors.date}</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="url_site">
                <b>Url Site</b>
              </label>
              <Input
                type="text"
                name="url_site"
                placeholder="Url site"
                value={item.url_site}
                onChange={handleChange}
                invalid={
                  errors.url_site !== undefined && errors.url_site !== ""
                }
              />
              {errors.url_site && (
                <div className="error-message">{errors.url_site}</div>
              )}
            </div>
            <div>
              <label htmlFor="url_article">
                <b>Url Article</b>
              </label>
              <Input
                type="text"
                name="url_article"
                placeholder="Url article"
                value={item.url_article}
                onChange={handleChange}
                invalid={
                  errors.url_article !== undefined && errors.url_article !== ""
                }
              />
              {errors.url_article && (
                <div className="error-message">{errors.url_article}</div>
              )}
            </div>
            <div>
              <label htmlFor="summary">
                <b>Résumé</b>
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
            <div>
              <label htmlFor="read">
                <b>Consulté</b>
              </label>
              <br />
              <Input
                type="checkbox"
                name="read"
                checked={item.read}
                onChange={handleChange}
              />
              {errors.read && (
                <div className="error-message">{errors.read}</div>
              )}
            </div>
            <div>
              <label htmlFor="favoris">
                <b>Favoris</b>
              </label>
              <br />
              <Input
                type="checkbox"
                name="favoris"
                checked={item.favorite}
                onChange={handleChange}
              />
              {errors.favoris && (
                <div className="error-message">{errors.favoris}</div>
              )}
            </div>
            <div>
              <Tags onChange={handleTagChange} currentTags={activeItem.tags} />
            </div>
          </div>
        </form>
        <div className="flex flex-col justify-content-center items-center">
          <button
            className="bg-green-600 hover:bg-green-800 text-white w-64 py-2 px-6 rounded"
            onClick={() => validateForm()}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

// Exportation
export default FormArticle;
