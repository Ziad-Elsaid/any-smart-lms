import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ 
  formControls = [], 
  formData, 
  setFormData,
  validationErrors = {},
  touchedFields = {},
  onFieldBlur = () => {},
}) {
  // Track password visibility state for each password field
  const [passwordVisibility, setPasswordVisibility] = useState({});

  function togglePasswordVisibility(fieldName) {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }

  // Check if field has error and has been touched
  function hasError(fieldName) {
    return touchedFields[fieldName] && validationErrors[fieldName];
  }

  // Get error message for field
  function getErrorMessage(fieldName) {
    return touchedFields[fieldName] ? validationErrors[fieldName] : null;
  }

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const fieldHasError = hasError(getControlItem.name);

    const commonInputClasses = `
      bg-white
      border
      ${fieldHasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#1E4D2B] focus:ring-[#1E4D2B]/20'}
      outline-none
      focus:outline-none
      focus-visible:outline-none
      focus:ring-2
      focus:ring-offset-0
      transition
    `;

    switch (getControlItem.componentType) {
      case "input":
        // Check if this is a password field
        if (getControlItem.type === "password") {
          const isVisible = passwordVisibility[getControlItem.name];
          element = (
            <div className="relative">
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={isVisible ? "text" : "password"}
                value={currentControlItemValue}
                className={`${commonInputClasses} pr-10`}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                onBlur={() => onFieldBlur(getControlItem.name)}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(getControlItem.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={isVisible ? "Hide password" : "Show password"}
              >
                {isVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          );
        } else {
          element = (
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              className={commonInputClasses}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              onBlur={() => onFieldBlur(getControlItem.name)}
            />
          );
        }
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) => {
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              });
              onFieldBlur(getControlItem.name);
            }}
            value={currentControlItemValue}
          >
            <SelectTrigger
              className={`
                w-full bg-white border
                ${fieldHasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#1E4D2B] focus:ring-[#1E4D2B]/20'}
                outline-none
                focus:outline-none
                focus-visible:outline-none
                focus:ring-2
                focus:ring-offset-0
                transition
              `}
              onBlur={() => onFieldBlur(getControlItem.name)}
            >
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            className={commonInputClasses}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            onBlur={() => onFieldBlur(getControlItem.name)}
          />
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            className={commonInputClasses}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            onBlur={() => onFieldBlur(getControlItem.name)}
          />
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controleItem) => {
        const errorMessage = getErrorMessage(controleItem.name);
        return (
          <div key={controleItem.name} className="space-y-1">
            <Label
              htmlFor={controleItem.name}
              className={`text-sm font-medium ${hasError(controleItem.name) ? 'text-red-600' : 'text-gray-700'}`}
            >
              {controleItem.label}
            </Label>
            {renderComponentByType(controleItem)}
            {/* Inline error message */}
            <div 
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                errorMessage ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-xs text-red-500 mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormControls;

