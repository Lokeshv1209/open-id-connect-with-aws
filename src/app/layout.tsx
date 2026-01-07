import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";

import { Providers } from "./provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LFB",
  description: "LFB Application",
  icons: {
    icon: "/LFBLogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat antialiased  max-h-[1080px] overflow-hidden h-screen my-0`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "transparent",
              border: "none",
              boxShadow: "none",
            },
            className: "!bg-transparent",
          }}
        />
      </body>
    </html>
  );
}
