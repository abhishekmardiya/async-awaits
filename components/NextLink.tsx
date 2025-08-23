import Link from "next/link";
import { HTMLAttributeAnchorTarget, ReactNode } from "react";

import ROUTES from "@/constants/routes";

interface NextLinkProps {
  children: ReactNode;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  prefetch?: boolean;
  scroll?: boolean;
  className?: string;
}

export const NextLink = ({
  children,
  href,
  target,
  prefetch,
  scroll,
  className,
}: NextLinkProps) => {
  return (
    <Link
      href={href || ROUTES?.HOME}
      target={target || "_self"}
      prefetch={prefetch || false}
      scroll={scroll || false}
      className={className}
    >
      {children}
    </Link>
  );
};
