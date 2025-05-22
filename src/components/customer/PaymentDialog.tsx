"use client";

import { useState } from "react";
import { HiOutlineX, HiClipboardCheck } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa6";

interface PaymentDialogProps {
  amount: number;
  transactionId: string;
  onClose: () => void;
  onVerify: () => void;
}

export default function PaymentDialog({
  amount,
  transactionId,
  onClose,
  onVerify,
}: PaymentDialogProps) {
  const [copiedStates, setCopiedStates] = useState({
    amount: false,
    paybill: false,
    account: false,
    transactionId: false,
  });

  // Add copy to clipboard function
  const copyToClipboard = (
    text: string,
    field: "amount" | "paybill" | "account" | "transactionId"
  ) => {
    navigator.clipboard.writeText(text).then(() => {
      // Set the copied state for this field to true
      setCopiedStates((prev) => ({ ...prev, [field]: true }));

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [field]: false }));
      }, 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">
                  Ksh {amount.toLocaleString()}
                </span>
                <button
                  onClick={() => copyToClipboard(amount.toString(), "amount")}
                  className="text-gray-500 hover:text-green-500 focus:outline-none relative"
                  aria-label="Copy amount"
                >
                  {copiedStates.amount ? (
                    <HiClipboardCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaRegCopy className="w-5 h-5" />
                  )}
                  {copiedStates.amount && (
                    <span className="absolute right-0 bottom-full mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paybill Number:</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">508400</span>
                <button
                  onClick={() => copyToClipboard("5088400", "paybill")}
                  className="text-gray-500 hover:text-green-500 focus:outline-none relative"
                  aria-label="Copy paybill number"
                >
                  {copiedStates.paybill ? (
                    <HiClipboardCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaRegCopy className="w-5 h-5" />
                  )}
                  {copiedStates.paybill && (
                    <span className="absolute right-0 bottom-full mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Number:</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">10031206003165</span>
                <button
                  onClick={() => copyToClipboard("10031206003165", "account")}
                  className="text-gray-500 hover:text-green-500 focus:outline-none relative"
                  aria-label="Copy account number"
                >
                  {copiedStates.account ? (
                    <HiClipboardCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaRegCopy className="w-5 h-5" />
                  )}
                  {copiedStates.account && (
                    <span className="absolute right-0 bottom-full mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID:</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">{transactionId}</span>
                <button
                  onClick={() =>
                    copyToClipboard(transactionId, "transactionId")
                  }
                  className="text-gray-500 hover:text-green-500 focus:outline-none relative"
                  aria-label="Copy transaction ID"
                >
                  {copiedStates.transactionId ? (
                    <HiClipboardCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaRegCopy className="w-5 h-5" />
                  )}
                  {copiedStates.transactionId && (
                    <span className="absolute right-0 bottom-full mb-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Please make the payment using M-Pesa. After payment, click the
              Verify Transaction button to provide your M-Pesa code.
            </p>
          </div>
          <button
            onClick={onVerify}
            className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Verify Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
