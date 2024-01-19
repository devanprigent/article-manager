// Libraries
import React, { useState, ChangeEvent, FunctionComponent } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from "reactstrap";
import { FormProps, Article, Tag } from "./Types";
import Tags from "./Tags";
import * as yup from 'yup';

const validationSchema = yup.object({
    titre: yup.string().required(" "),
    auteur: yup.string().required(" "),
    url_site: yup.string().url(" ").required(" "),
    url_article: yup.string().url(" ").required(" "),
    date: yup.date().required(" "),
    synopsis: yup.string().required(" "),
});

/**
 * The goal of this component is to provide a modal form for adding or editing an article. 
 */
const FormArticle: FunctionComponent<FormProps<Article>> = ({ isOpen, toggle, onSave, title, activeItem }) => {
    const [item, setItem] = useState(activeItem);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleTagChange(newTags: Tag[]): void {
        setItem((prevItem) => ({ ...prevItem, "tags": newTags }));
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.currentTarget;
        setItem((prevItem) => ({ ...prevItem, [name]: value }));
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
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}><b>{title}</b></ModalHeader>
            <ModalBody>
                <div className="container">
                    <Form>
                        <FormGroup>
                            <Label for="titre">
                                <b>Titre</b>
                            </Label>
                            <Input
                                type="text"
                                name="titre"
                                placeholder="Titre"
                                value={item.titre}
                                onChange={handleChange}
                                invalid={errors.titre !== undefined && errors.titre !== ""}
                            />
                            {errors.titre && <div className="error-message">{errors.titre}</div>}
                        </FormGroup>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <Label for="auteur">
                                    <b>Auteur</b>
                                </Label>
                                <Input
                                    type="text"
                                    name="auteur"
                                    placeholder="Auteur"
                                    value={item.auteur}
                                    onChange={handleChange}
                                    invalid={errors.auteur !== undefined && errors.auteur !== ""}
                                />
                                {errors.auteur && <div className="error-message">{errors.auteur}</div>}
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
                                {errors.date && <div className="error-message">{errors.date}</div>}
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
                                invalid={errors.url_site !== undefined && errors.url_site !== ""}
                            />
                            {errors.url_site && <div className="error-message">{errors.url_site}</div>}
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
                                invalid={errors.url_article !== undefined && errors.url_article !== ""}
                            />
                            {errors.url_article && <div className="error-message">{errors.url_article}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="synopsis">
                                <b>Synopsis</b>
                            </Label>
                            <Input
                                type="textarea"
                                name="synopsis"
                                value={item.synopsis}
                                onChange={handleChange}
                                invalid={errors.synopsis !== undefined && errors.synopsis !== ""}
                            />
                            {errors.synopsis && <div className="error-message">{errors.synopsis}</div>}
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
}

// Exportation
export default FormArticle;
