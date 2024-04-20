// Libraries
import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";
import { Article, Tag } from "../Tools/Types";
import { getArticlesURL } from "../Tools/Urls";
import FormArticle from "./FormArticle";
import ButtonDelete from "../Buttons/ButtonDelete";
import ButtonEdit from "../Buttons/ButtonEdit";

interface DetailsArticleProps {
  isOpen: boolean;
  toggle: () => void;
  fetchData: () => void;
  title: string;
  activeItem: Article;
}

/**
 * The goal of this component is to provide a modal form for adding or editing an article.
 */
function FormDetailsArticle({
  isOpen,
  toggle,
  fetchData,
  title,
  activeItem,
}: Readonly<DetailsArticleProps>) {
  const API_URL_ARTICLES: string = getArticlesURL();

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <b className="h1">{title}</b>
      </ModalHeader>
      <ModalBody>
        <div className="container">
          <div className="d-flex mb-3">
            <div className="col-md-5">
              <b>Nom :</b> {activeItem.nom}
            </div>
            <div className="col-md-7">
              <b>URL Site : </b>
              <a
                href={activeItem.url_site}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeItem.url_site}
              </a>
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="col-md-5">
              <b>Auteur :</b> {activeItem.auteur}
            </div>
            <div className="col-md-7">
              <b>URL Article : </b>
              <a
                href={activeItem.url_article}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeItem.url_article}
              </a>
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="col-md-5">
              <b>Date : </b> {activeItem.date}
            </div>
            <div className="col-md-7">
              <b>Tags : </b>{" "}
              {activeItem.tags.map((tag: Tag) => tag.nom).join(", ")}
            </div>
          </div>
          <div className="d-flex mb-3">
            <div className="col-md-5">
              <b>Consulté : </b> <Checkbox disabled checked={activeItem.read} />
            </div>
            <div className="col-md-7">
              <b>Favoris : </b>{" "}
              <Checkbox disabled checked={activeItem.favoris} />
            </div>
          </div>
          <div className="row">
            <b>Résumé : </b> {activeItem.summary}
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <div className="d-flex justify-content-between w-100">
          <ButtonEdit<Article>
            fetchData={fetchData}
            urlToRequest={API_URL_ARTICLES}
            FormComponent={FormArticle}
            title={"Modification d'un article"}
            activeItem={activeItem}
          />
          <ButtonDelete
            fetchData={fetchData}
            urlToRequest={API_URL_ARTICLES}
            itemId={activeItem.id}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}

// Exportation
export default FormDetailsArticle;
