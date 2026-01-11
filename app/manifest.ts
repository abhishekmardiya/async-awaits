import type { MetadataRoute } from "next";
import { SITE_INFO } from "@/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_INFO.title,
    short_name: SITE_INFO.title,
    description: SITE_INFO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
