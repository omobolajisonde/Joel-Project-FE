import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/stylesheets/main.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Attendance UI",
  description: "Fingerprint based attendance UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
