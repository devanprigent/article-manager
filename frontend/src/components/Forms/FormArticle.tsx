// Libraries
import React, { useState, ChangeEvent, FunctionComponent } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import CreatableSelect from "react-select/creatable";
import { FormProps, Tag, Article } from "../Tools/Types";
import Tags from "../Forms/FormTags";
import * as yup from "yup";
import { getArticlesURL } from "../Tools/Urls";
import FetchData from "../Tools/FetchData";

const validationSchema = yup.object({
  nom: yup.string().required(" "),
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
 * The goal of this component is to provide a modal form for adding or editing an article.
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
    .map((article: Article) => article.auteur)
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
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <b>{title}</b>
      </ModalHeader>
      <ModalBody>
        <div className="container">
          <Form>
            <FormGroup>
              <Label for="nom">
                <b>Titre</b>
              </Label>
              <Input
                type="text"
                name="nom"
                placeholder="Titre"
                value={item.nom}
                onChange={handleChange}
                invalid={errors.nom !== undefined && errors.nom !== ""}
              />
              {errors.nom && <div className="error-message">{errors.nom}</div>}
            </FormGroup>
            <div className="row">
              <FormGroup className="col-md-6">
                <Label for="auteur">
                  <b>Auteur</b>
                </Label>
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
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label for="date">
                  <b>Année</b>
                </Label>
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
              </FormGroup>
            </div>
            <FormGroup>
              <Label for="url_site">
                <b>Url Site</b>
              </Label>
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
            </FormGroup>
            <FormGroup>
              <Label for="url_article">
                <b>Url Article</b>
              </Label>
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
            </FormGroup>
            <FormGroup>
              <Label for="summary">
                <b>Résumé</b>
              </Label>
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
            </FormGroup>
            <FormGroup>
              <Label for="read">
                <b>Consulté</b>
              </Label>
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
            </FormGroup>
            <FormGroup>
              <Label for="favoris">
                <b>Favoris</b>
              </Label>
              <br />
              <Input
                type="checkbox"
                name="favoris"
                checked={item.favoris}
                onChange={handleChange}
              />
              {errors.favoris && (
                <div className="error-message">{errors.favoris}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Tags onChange={handleTagChange} currentTags={activeItem.tags} />
            </FormGroup>
          </Form>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button color="success" onClick={() => validateForm()}>
          Enregistrer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Exportation
export default FormArticle;
