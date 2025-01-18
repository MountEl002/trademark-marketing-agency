// components/GoogleOneTap.tsx
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          CredentialResponse: any;
          initialize: (config: unknown) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

const GoogleOneTap = () => {
  const { user, signInWithGoogle } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Don't show for signed-in users or admin paths
    if (user || pathname?.startsWith("/admin")) {
      return;
    }

    // Load Google Client Script
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
        callback: async (response: google.accounts.id.CredentialResponse) => {
          if (response.credential) {
            try {
              await signInWithGoogle();
            } catch (error) {
              console.error("Error signing in:", error);
            }
          }
        },
        prompt_parent_id: "g_id_onload",
        auto_select: true,
      });

      // Show the prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
        window.google?.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowPrompt(false);
          }
        });
      }, 1000);
    };

    return () => {
      script.remove();
      setShowPrompt(false);
    };
  }, [user, pathname, signInWithGoogle]);

  if (!showPrompt) return null;

  return (
    <div
      id="g_id_onload"
      className="fixed top-4 left-4 z-50"
      data-auto_select="true"
      data-skip_prompt_cookie="false"
    />
  );
};

export default GoogleOneTap;
