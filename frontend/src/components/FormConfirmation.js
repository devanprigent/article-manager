// Bibliothèques
import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

/**
 * Le rôle de ce composant est d'afficher une boîte de dialogue de confirmation
 * avec un message de confirmation et deux boutons, "Annuler" et "Valider".
 * Il est utilisé pour demander une confirmation à l'utilisateur avant d'effectuer une action.
 * Dans PEPH, il est utilisé uniquement pour les suppressions.
 */
function FormConfirmation({ isOpen, toggle, onSave }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Confirmation</ModalHeader>
      <ModalBody>Etes-vous sûr de vouloir supprimer cet élément ?</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
          Annuler
        </Button>
        <Button className="ml-auto" color="success" onClick={onSave}>
          Valider
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default FormConfirmation;
