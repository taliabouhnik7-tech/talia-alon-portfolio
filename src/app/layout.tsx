import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Talia Alon, UX/UI designer",
  description:
    "Portfolio of Talia Alon, a UX/UI designer with a background in cognitive science. Research, interface design and shipped products.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-graphite">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
