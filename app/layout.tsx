import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers/ConvexProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbicast",
  description: "Listen to your podcasts and generate them with AI",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
