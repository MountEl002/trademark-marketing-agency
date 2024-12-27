import React from "react";
import ContinueWithGoogle from "./continueWithGoogle";
import ContinueWithApple from "./continueWithApple";
import ContinueWithFacebook from "./continueWithFb";
import ContinueWithTwitter from "./continueWithTwitter";

const ContinueWith = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <ContinueWithGoogle />
      </div>
      <div>
        <ContinueWithApple />
      </div>
      <div>
        <ContinueWithFacebook />
      </div>
      <div>
        <ContinueWithTwitter />
      </div>
    </div>
  );
};

export default ContinueWith;
