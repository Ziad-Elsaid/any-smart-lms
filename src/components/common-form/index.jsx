import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  validationErrors = {},
  touchedFields = {},
  onFieldBlur = () => {},
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* render form controls here */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        touchedFields={touchedFields}
        onFieldBlur={onFieldBlur}
      />

      <Button
        disabled={isButtonDisabled}
        type="submit"
        className="
          mt-5 w-full
          bg-[#1E4D2B] text-white
          hover:bg-[#173E23]
          disabled:bg-[#1E4D2B]/50
          disabled:cursor-not-allowed
          shadow-sm
          transition-colors
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#1E4D2B]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-white
        "
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
