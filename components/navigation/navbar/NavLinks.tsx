"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { NextLink } from "@/components/NextLink";
import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

export const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks?.map((el) => {
        const isActive =
          (pathname?.includes(el?.route) && el?.route?.length > 1) ||
          pathname === el?.route;

        if (el.route === "/profile") {
          if (userId) {
            el.route = `${el.route}/${userId}`;
          } else {
            return null;
          }
        }

        const linkComponent = (
          <NextLink
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
          </NextLink>
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
