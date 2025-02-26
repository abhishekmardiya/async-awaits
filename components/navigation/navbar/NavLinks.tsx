"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  // FIXME:dummy id
  const userId = 1;

  return (
    <>
      {sidebarLinks?.map((el) => {
        const isActive =
          (pathname?.includes(el?.route) && el?.route?.length > 1) ||
          pathname === el?.route;

        if (el?.route === ROUTES?.PROFILE) {
          if (userId) {
            el.route = `${el?.route}/${userId}`;
          } else {
            return null;
          }
        }

        const linkComponent = (
          <Link
            href={el?.route}
            key={el?.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={el?.imgURL}
              alt={el?.label}
              width={20}
              height={20}
              className={cn({ "invert-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {el?.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={el?.route}>
            {linkComponent}
          </SheetClose>
        ) : (
          <Fragment key={el?.route}>{linkComponent}</Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
