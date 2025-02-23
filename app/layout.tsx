import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import { auth } from "@/auth";
import ThemeProvider from "@/context/Theme";

import "./globals.css";

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

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
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
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default MainLayout;
