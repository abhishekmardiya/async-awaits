"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

interface Props {
  imgSrc: string;
  placeholder: string;
  route?: string;
  otherClasses: string;
}

const LocalSearch = ({ imgSrc, placeholder, route, otherClasses }: Props) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (searchQuery) {
        newUrl = formUrlQuery({
          params: searchParams?.toString(),
          key: "query",
          value: searchQuery,
        });
      } else {
        if (pathname === route) {
          newUrl = removeKeysFromUrlQuery({
            params: searchParams?.toString(),
            keysToRemove: ["query"],
          });
        }
      }
      push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, route, searchParams, push, pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <Image
        src={imgSrc}
        width={24}
        height={24}
        alt="Icon"
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearch;
