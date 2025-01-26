import LoadingAnimantion from "@/components/common/LoadingAnimantion";

interface OrderActivationDialogProps {
  isOpen: boolean;
  activating: boolean;
  successActivating: boolean;
  errorActivating: boolean;
  modificationError: Error | null;
  openActiveOrders: () => void;
  goBackToDraft: () => void;
}

const OrderActivationDialog: React.FC<OrderActivationDialogProps> = ({
  isOpen,
  activating,
  successActivating,
  errorActivating,
  modificationError,
  openActiveOrders,
  goBackToDraft,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
      {activating ? (
        <LoadingAnimantion />
      ) : (
        <div
          className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${
            successActivating || errorActivating ? "vertical" : ""
          }`}
        >
          {successActivating ? (
            <>
              <p>
                The order has been successfully activated. We have started
                working on it.
              </p>
              <p>
                Feel free to contanct the administrator or support for progress
                update, clarification, or any other reason you might have. We
                are available 24/7.
              </p>
              <p>
                Thank you for choosing High-<span>Quality</span>Essay
              </p>
              <div className="w-full horizontal mt-8">
                <button onClick={openActiveOrders} className="button-blue">
                  Open active orders
                </button>
              </div>
            </>
          ) : modificationError ? (
            <>
              <p>
                Order activation failed because your account balance is less
                than the totol price of the order.
              </p>
              <p>Please add funds to your account or contact support.</p>
              <div className="w-full horizontal-end gap-4">
                <button onClick={goBackToDraft} className="button-blue mt-8">
                  Go back to draft
                </button>
                <button onClick={goBackToDraft} className="button-blue mt-8">
                  Contact support
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Order activation failed.</p>
              <p>Please chech your internet connection and try again.</p>
              <p>
                If the issue persist, log out and log back in then try again.
              </p>
              <div className="w-full horizontal-end">
                <button onClick={goBackToDraft} className="button-blue mt-8">
                  Go back to draft
                </button>
                <button onClick={goBackToDraft} className="button-blue mt-8">
                  Try again
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default OrderActivationDialog;
