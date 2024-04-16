import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthCheckProvider } from "@/components/auth/AuthCheckProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CCL Vietnamese Portal",
  description: "CCL Vietnamese Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheckProvider>{children}</AuthCheckProvider>
      </body>
    </html>
  );
}
