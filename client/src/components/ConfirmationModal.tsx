import { Backdrop } from "./Backdrop";

/**
 * ConfirmationModal component.
 * Renders a modal with a title, text and two buttons: a submit button and a cancel button.
 * @param title - The title of the modal.
 * @param text - The text to be displayed in the modal.
 * @param handleSubmit - The function to be triggered when the submit button is clicked.
 * @param handleClose - The function to be triggered when the cancel button or the backdrop is clicked.
 * @returns - The ConfirmationModal component.
 */
export function ConfirmationModal({
  title,
  text,
  handleSubmit,
  handleClose,
}: {
  title: string;
  text: string;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleClose: () => void;
}) {
  return (
    // The backdrop component covers the entire parent component and triggers the handleClose function when clicked
    <Backdrop onClick={handleClose}>
      {/* The modal component */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col p-6 shadow-xl gap-10 rounded-md bg-white-color border border-border z-50"
      >
        <div className="text-center max-w-80">
          {/* The title of the modal */}
          <h1 className="text-2xl font-bold text-text mb-1">{title}</h1>
          {/* The text to be displayed in the modal */}
          <p className="text-secondary-text">{text}</p>
        </div>
        {/* The form component */}
        <div className="flex flex-col gap-3 child:p-2 child:w-full child:rounded-md">
          {/* The submit button */}
          <button
            onClick={handleSubmit}
            className="bg-secondary-red text-white-color"
          >
            מחיקה
          </button>
          {/* The cancel button */}
          <button
            onClick={handleClose}
            type="button"
            className="border border-border text-text box-border"
          >
            ביטול
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
