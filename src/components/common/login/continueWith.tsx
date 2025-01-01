import React from "react";
import ContinueWithGoogle from "./continueWithGoogle";
import ContinueWithApple from "./continueWithApple";
import ContinueWithFacebook from "./continueWithFb";
import ContinueWithTwitter from "./continueWithTwitter";

const ContinueWith = () => {
  return (
    <div className="w-full horizontal-space-between">
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
