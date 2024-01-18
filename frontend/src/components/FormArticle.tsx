// Libraries
import React, { useState, KeyboardEvent } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from "reactstrap";
import { FormProps } from "./Types";
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
function FormArticle({ isOpen, toggle, onSave, title, activeItem }: FormProps) {
    const [item, setItem] = useState(activeItem);
    const [errors, setErrors] = useState({});

    function handleChange(e: KeyboardEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setItem((prevItem) => ({ ...prevItem, [name]: value }));
    }

    function validateForm() {
        validationSchema
            .validate(item, { abortEarly: false })
            .then(() => {
                onSave(item);
                toggle();
            })
            .catch((error) => {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
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
                                invalid={errors.titre}
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
                                    invalid={errors.auteur}
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
                                    invalid={errors.date}
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
                                invalid={errors.url_site}
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
                                invalid={errors.url_article}
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
                                invalid={errors.synopsis}
                            />
                            {errors.synopsis && <div className="error-message">{errors.synopsis}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Tags onChange={handleChange} />
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
