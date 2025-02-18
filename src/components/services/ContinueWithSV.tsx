"use client";

import ContinueWithGoogle from "../common/login/ContinueWithGoogle";
import ContinueWithFacebook from "../common/login/ContinueWithFb";
import { useAuth } from "@/contexts/AuthContext";

const ContinueWith = () => {
  const { user } = useAuth();
  if (user) return null;
  return (
    <div className="flex sm:flex-row flex-col justify-center items-center gap-4 my-6">
      <ContinueWithGoogle
        className="continue-with-gf !w-fit px-4"
        text="Continue with Google"
      />
      <ContinueWithFacebook
        className="continue-with-gf !w-fit px-4"
        text="Continue with Facebook"
      />
    </div>
  );
};

export default ContinueWith;
