// Libraries
import React from "react";
import PopupWrapper from "../Wrappers/PopupWrapper";

interface FormConfirmationProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: () => void;
}

/**
 * Le rôle de ce composant est d'afficher une boîte de dialogue de confirmation
 * avec un message de confirmation et deux boutons, "Annuler" et "Valider".
 * Il est utilisé pour demander une confirmation à l'utilisateur avant d'effectuer une action.
 * Dans PEPH, il est utilisé uniquement pour les suppressions.
 */
function ConfirmationForm({
  isOpen,
  toggle,
  onSave,
}: Readonly<FormConfirmationProps>) {
  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="flex flex-col space-y-6">
        <h1 className="text-center text-black font-bold text-2xl">
          {"Confirmation"}
        </h1>
        <div>{"Etes-vous sûr de vouloir supprimer cet élément ?"}</div>
        <div className="flex flex-row justify-between">
          <button
            className="bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded"
            onClick={toggle}
          >
            Annuler
          </button>
          <button
            className="ml-auto bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded"
            onClick={onSave}
          >
            Valider
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default ConfirmationForm;
