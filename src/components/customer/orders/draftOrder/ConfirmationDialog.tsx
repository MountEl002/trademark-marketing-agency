import LoadingAnimantion from "@/components/common/LoadingAnimantion";

interface ConfirmationDialogProps {
  isOpen: boolean;
  discarding: boolean;
  successDiscarding: boolean;
  errorDiscarding: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  discarding,
  successDiscarding,
  errorDiscarding,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${
          successDiscarding || errorDiscarding ? "vertical" : ""
        }`}
      >
        {successDiscarding || errorDiscarding ? (
          successDiscarding ? (
            <>
              <p>Draft discarded successfully!</p>
              <div className="w-full horizontal mt-8">
                <button onClick={onClose} className="button-blue">
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Failed to discard draft! Please check your internet connection
                and try agin. <br />{" "}
                <span className="mt-2">
                  If the issue persists, logout and login, then try again.
                </span>
              </p>
              <div className="w-full horizontal-end">
                <button onClick={onClose} className="button-blue mt-8">
                  Close
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
              {discarding ? (
                <div className="horizontal w-full">
                  <LoadingAnimantion />
                </div>
              ) : (
                <div className="w-full horizontal-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button onClick={onConfirm} className="button-red">
                    Discard
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ConfirmationDialog;
