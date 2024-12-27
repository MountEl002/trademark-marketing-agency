import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

const SocialMedia = () => {
  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaXTwitter, href: "#", label: "Twitter" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
    { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
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
