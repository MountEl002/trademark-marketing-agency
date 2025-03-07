// components/ScrollLink.tsx
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode, useCallback, MouseEvent } from "react";

interface ScrollLinkProps {
  href: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

export const ScrollToElement = ({
  href,
  id,
  children,
  className,
}: ScrollLinkProps) => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const [pathname, hash] = href.split("#");
      const targetId = hash || "";

      // If we're already on the correct page, just scroll to the element
      if (currentPath === pathname) {
        scrollToElement(targetId);
      } else {
        // Otherwise, navigate to the new page and then scroll after the page loads
        router.push(href);
        const handleRouteChange = () => {
          scrollToElement(targetId);
        };

        router.push(href);
        window.addEventListener("routeChangeComplete", handleRouteChange);

        return () => {
          window.removeEventListener("routeChangeComplete", handleRouteChange);
        };
      }
    },
    [href, currentPath, router]
  );

  const scrollToElement = (id: string) => {
    if (!id) return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Link href={href} id={id} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};
