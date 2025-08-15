import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";
import { Oxanium } from "next/font/google"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import MovingLogo from "@/components/MovingLogo";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Add the weights you need
});

export const metadata: Metadata = {
  title: {
    default: "HiddenEcho | Your Thoughts, Unfiltered",
    template: "HiddenEcho | %s",
  },
  description:
    "Share what's on your mind with complete anonymity. A safe space for real opinions and honest conversations.",
  icons: {
    icon: "/favicon.png", // or '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body  className={oxanium.className}>
          <Toaster expand={false} />
          <Navbar/>
          <MovingLogo/>
          {children}
          <Footer/>
        </body>
      </AuthProvider>
    </html>
  );
}
