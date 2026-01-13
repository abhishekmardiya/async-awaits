import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { auth } from "@/auth";
import ThemeProvider from "@/context/Theme";

import "./globals.css";
import { SITE_INFO } from "@/constants";
import { PageTransitionProgressBar } from "@/components/PageTransitionProgressBar";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const viewport: Viewport = {
  themeColor: "#18181b",
};

export const metadata: Metadata = {
  title: SITE_INFO.title,
  description: SITE_INFO.description,
  // generator -->  Used in some browser UIs and when the site is saved to a home screen. It helps define what your app is called in places like Progressive Web Apps (PWAs) and mobile browsers.
  generator: "Next.js",
  applicationName: SITE_INFO.title,
  referrer: "origin-when-cross-origin",
  // formatDetection --> This prevents browsers (especially on mobile) from automatically linking email addresses, phone numbers, or addresses in your content.
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: SITE_INFO.title,
    description: SITE_INFO.description,
    siteName: SITE_INFO.title,
    images: [
      {
        url: `${SITE_INFO.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_INFO.title} OG Banner`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_INFO.title,
    description: SITE_INFO.description,
    images: [`${SITE_INFO.url}/opengraph-image.png`],
  },
  robots: {
    index: true,
    follow: true, // bots should follow the links on this page and crawl them too
    nocache: true, // tels bots not to store a cached version of the page
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const MainLayout = async ({ children }: { children: ReactNode }) => {
  /*
  session: {
    user: {
      name: 'Abhishek Mardiya',
      email: 'mardiyaabhishek@gmail.com',
      image: 'https://avatars.githubusercontent.com/u/97448460?v=4'
    },
    expires: '2025-03-25T09:39:15.277Z'
  }
  */
  const session = await auth();

  return (
    // suppressHydrationWarning only suppress hydration warning for one level deep only which is next-theme related warnings.It does not suppress all hydration warnings.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
        >
          {/* https://ui.shadcn.com/docs/dark-mode/next */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PageTransitionProgressBar>{children}</PageTransitionProgressBar>{" "}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
          <Toaster position="top-center" />
        </body>
      </SessionProvider>
    </html>
  );
};

export default MainLayout;
