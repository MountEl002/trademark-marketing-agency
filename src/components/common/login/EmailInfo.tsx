import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

const EmailInfo = () => {
  return (
    <>
      <BsInfoCircle
        data-tooltip-id="email-use-info"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors rounded-[50%] w-6 h-6"
      />
      <Tooltip id="email-use-info">
        <div className="text-start">
          <p className="text-sm font-semibold mb-2">
            We will use your e-mail strictly for :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Communications regarding your orders</li>
            <li>Sending you invoices and other billing information</li>
          </ul>
        </div>
      </Tooltip>
    </>
  );
};

export default EmailInfo;
