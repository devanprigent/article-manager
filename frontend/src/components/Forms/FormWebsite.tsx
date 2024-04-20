// Libraries
import React, { useState, ChangeEvent, FunctionComponent } from "react";
import { Input } from "reactstrap";
import { FormProps, WebSite } from "../Tools/Types";
import PopupWrapper from "../Wrappers/PopupWrapper";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required("The name of the site is required."),
  url: yup
    .string()
    .url("Invalid url format.")
    .required("The url of the site is required."),
  image_url: yup.string().url("Invalid url format."),
});

/**
 * The goal of this component is to provide a modal form htmlFor adding or editing a website.
 */
const FormWebsite: FunctionComponent<FormProps<WebSite>> = ({
  isOpen,
  toggle,
  onSave,
  title,
  activeItem,
}) => {
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
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="flex flex-col space-y-4">
        <h1 className="text-center text-red-600 font-bold text-2xl">{title}</h1>
        <form>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="font-bold" htmlFor="name">
                Nom
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Nom"
                value={item.name}
                onChange={handleChange}
                invalid={errors.name !== undefined && errors.name !== ""}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div>
              <label className="font-bold" htmlFor="url">
                Site
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
              <label className="font-bold" htmlFor="image_url">
                Logo
              </label>
              <Input
                type="text"
                name="image_url"
                placeholder="Url"
                value={item.image_url}
                onChange={handleChange}
                invalid={
                  errors.image_url !== undefined && errors.image_url !== ""
                }
              />
              {errors.image_url && (
                <div className="error-message">{errors.image_url}</div>
              )}
            </div>
          </div>
        </form>
        <div className="flex flex-row justify-center m-4">
          <button
            className="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded"
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
export default FormWebsite;
