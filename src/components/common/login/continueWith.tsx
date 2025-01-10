import React from "react";
import ContinueWithGoogle from "./ContinueWithGoogle";
import ContinueWithApple from "./ContinueWithApple";
import ContinueWithFacebook from "./ContinueWithFb";
import ContinueWithTwitter from "./ContinueWithTwitter";

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
