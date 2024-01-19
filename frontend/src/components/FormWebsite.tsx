// Libraries
import React, { useState, ChangeEvent, FunctionComponent } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from "reactstrap";
import { FormProps, WebSite } from "./Types";
import * as yup from 'yup';

const validationSchema = yup.object({
    nom: yup.string().required('Le nom du site est requis.'),
    url: yup.string().url('Format de l\'url invalide.').required('L\'url du site est requise.'),
    image_url: yup.string().url('Format de l\'url invalide.'),
});

/**
 * The goal of this component is to provide a modal form for adding or editing a website. 
 */
const FormWebsite: FunctionComponent<FormProps<WebSite>> = ({ isOpen, toggle, onSave, title, activeItem }) => {
    const [item, setItem] = useState(activeItem);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
                <Form>
                    <FormGroup>
                        <Label for="nom"><b>Nom</b></Label>
                        <Input
                            type="text"
                            name="nom"
                            placeholder="Nom"
                            value={item.nom}
                            onChange={handleChange}
                            invalid={errors.nom !== undefined && errors.nom !== ""}
                        />
                        {errors.nom && <div className="error-message">{errors.nom}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="url"><b>Site</b></Label>
                        <Input
                            type="text"
                            name="url"
                            placeholder="Url"
                            value={item.url}
                            onChange={handleChange}
                            invalid={errors.url !== undefined && errors.url !== ""}
                        />
                        {errors.url && <div className="error-message">{errors.url}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="image_url"><b>Logo</b></Label>
                        <Input
                            type="text"
                            name="image_url"
                            placeholder="Url"
                            value={item.image_url}
                            onChange={handleChange}
                            invalid={errors.image_url !== undefined && errors.image_url !== ""}
                        />
                        {errors.image_url && <div className="error-message">{errors.image_url}</div>}
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
export default FormWebsite;
