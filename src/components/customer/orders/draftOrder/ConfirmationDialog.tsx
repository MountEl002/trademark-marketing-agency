import LoadingAnimantion from "@/components/common/LoadingAnimantion";
import UniversalButton from "@/components/common/UniversalButton";
import { MdOutlineDelete } from "react-icons/md";

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

  const CloseButton = () => (
    <UniversalButton
      icon={MdOutlineDelete}
      onClick={onClose}
      text="Close"
      buttonClassName="bg-blue-500 hover:bg-blue-700"
      iconClassName="bg-blue-400 group-hover:bg-blue-600"
    />
  );

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-[70] flex items-center justify-center">
      <div
        className={`bg-gray-50 rounded-lg p-6 max-w-md w-full mx-4 ${
          successDiscarding || errorDiscarding ? "vertical" : ""
        }`}
      >
        {successDiscarding || errorDiscarding ? (
          successDiscarding ? (
            <>
              <p>Draft discarded successfully!</p>
              <div className="w-full horizontal mt-8">
                <CloseButton />
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
                <CloseButton />
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
                  <CloseButton />
                  <UniversalButton
                    icon={MdOutlineDelete}
                    text="Confirm"
                    onClick={onConfirm}
                    buttonClassName="bg-red-500 hover:bg-red-700"
                    iconClassName="bg-red-400 group-hover:bg-red-600"
                  />
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
