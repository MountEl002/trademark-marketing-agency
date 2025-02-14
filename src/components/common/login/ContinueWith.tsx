import React from "react";
import ContinueWithGoogle from "./ContinueWithGoogle";
import ContinueWithFacebook from "./ContinueWithFb";

const ContinueWith = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-10">
      <div>
        <ContinueWithGoogle className="continue-with-gf" />
      </div>
      <div>
        <ContinueWithFacebook className="continue-with-gf" />
      </div>
    </div>
  );
};

export default ContinueWith;
