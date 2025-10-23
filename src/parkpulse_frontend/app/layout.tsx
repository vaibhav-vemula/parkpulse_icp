import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import FlowProvider from "@/components/FlowProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParkPulse.ai - Urban Green Space Intelligence",
  description: "AI-powered urban parks and green space analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased font-sans`}
      >
        <FlowProvider>{children}</FlowProvider>
      </body>
    </html>
  );
}
