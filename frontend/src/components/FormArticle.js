// Libraries
import React, { useState } from "react";
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
import Tags from "./Tags";

/**
 * The goal of this component is to provide a modal form for adding or editing an article. 
 */
function FormArticle({ isOpen, toggle, onSave, title, activeItem }) {
    const [item, setItem] = useState(activeItem);

    function handleChange(e) {
        const { name, value } = e.target;
        setItem((prevItem) => ({ ...prevItem, [name]: value }));
    }

    function validateForm() {
        return onSave(item);
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="titre">Titre</Label>
                        <Input
                            type="text"
                            name="titre"
                            value={item.titre}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="auteur">Auteur</Label>
                        <Input
                            type="text"
                            name="auteur"
                            value={item.auteur}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="url_site">Url Site</Label>
                        <Input
                            type="text"
                            name="url_site"
                            value={item.url_site}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input
                            type="text"
                            name="date"
                            value={item.date}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="synopsis">Synopsis</Label>
                        <Input
                            type="text"
                            name="synopsis"
                            value={item.synopsis}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="url_article">Url Article</Label>
                        <Input
                            type="text"
                            name="url_article"
                            value={item.url_article}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleSelect">
                            Choix des tags
                        </Label>
                        <Tags onChange={handleChange} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={() => validateForm()}>
                    Enregistrer
                </Button>
            </ModalFooter>
        </Modal>
    );
}

// Exportation
export default FormArticle;
