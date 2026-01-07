import Image from "next/image";

import { cn } from "@/lib/utils";

import { NextLink } from "./NextLink";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  titleStyles?: string;
}

export const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imgStyles}`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        {title && (
          <span className={cn("small-regular line-clamp-1", titleStyles)}>
            {title}
          </span>
        )}
      </p>
    </>
  );

  return href ? (
    <NextLink href={href} className="flex-center gap-1">
      {metricContent}
    </NextLink>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};
