import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./provider";
import ThemeProvider from "../components/ThemeProviders";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sanika Blogs",
  description: "A blogging platform built with Next.js and Tailwind CSS",
  verification: {
    google: "RP0vRtcsn9giH12SZaTZo1jvVvsewweZooDTkr1ZZMA",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <ThemeProvider>
            <Navbar />
            <div className="SandeepYadav">{children}</div>
            <Footer />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
