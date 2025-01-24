import React from "react";
import ContinueWithGoogle from "./ContinueWithGoogle";
import ContinueWithFacebook from "./ContinueWithFb";
// import ContinueWithTwitter from "./ContinueWithTwitter";
// import ContinueWithApple from "./ContinueWithApple";

const ContinueWith = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-10">
      <div>
        <ContinueWithGoogle />
      </div>
      <div>
        <ContinueWithFacebook />
      </div>
      {/* <div>
        <ContinueWithTwitter />
      </div>
      <div>
        <ContinueWithApple />
      </div> */}
    </div>
  );
};

export default ContinueWith;
