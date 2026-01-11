import Image from "next/image";

import { auth } from "@/auth";
import { NextLink } from "@/components/NextLink";
import { UserAvatar } from "@/components/UserAvatar";
import { SITE_INFO } from "@/constants";
import { ROUTES } from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12 ">
      <NextLink href={ROUTES?.HOME} className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          alt={`${SITE_INFO.title} Logo`}
          width={23}
          height={23}
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Async<span className="text-primary-500">Awaits</span>{" "}
        </p>
      </NextLink>
      {/* TODO: Global Search */}
      <div className="flex-between gap-5">
        <Theme />

        {userId && (
          <UserAvatar
            id={userId}
            name={session?.user?.name ?? ""}
            imageUrl={session?.user?.image}
          />
        )}

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Navbar;
