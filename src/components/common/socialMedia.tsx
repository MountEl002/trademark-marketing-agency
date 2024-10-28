import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Music,
} from "lucide-react";

const SocialMedia = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Music, href: "#", label: "TikTok" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <div className="flex space-x-3">
      {socialLinks.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-blue-600"
        >
          <Icon className="w-5 h-5 text-white" />
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
