import React from "react";
import GetStarted from "./login/getStarted";

const PrivacyHighlight = () => {
  return (
    <div className="privacy-highlights max-w-6xl vertical text-center">
      <h2 className="text-gray-50">
        Essay writing service that keeps your data safe
      </h2>
      <div>
        <p>
          Getting paper writing help is not a shameful practice, yet we
          understand the wishes of our clients to keep their details
          confidential. Therefore, we have respectfully implemented encryption
          of the highest levels and only employ world renowned payment gateways
          so that both your personal information and card information are in
          safe hands.
        </p>
        <p>
          Say &ldquo;help write my essay&rdquo; knowing that you won&apos;t be
          exposed and that your data is managed with the highest standards of
          security.
        </p>
        <p>
          Hire essay writers and work with real pros, improve your academic
          performance, and get access to a unique set of bonuses.
        </p>
      </div>
      <GetStarted />
    </div>
  );
};

export default PrivacyHighlight;
