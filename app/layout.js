import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/ReduxProvider";
import { Toaster } from "sonner";
import AuthInitializer from "./_components/AuthInitializer";
import "react-quill-new/dist/quill.snow.css";
import Preloader from "./_components/preloder";
import { Suspense } from "react";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// const robotoMono = Roboto_Mono({
//   subsets: ["latin"],
//   variable: "--font-roboto-mono",
//   display: "swap",
// });

export const metadata = {
  title: "King Mansa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${inter.variable} ${robotoMono.variable} antialiased text-stone-800`}
        className={` antialiased text-stone-800`}
      >
        <Suspense fallback={null}>
          <ReduxProvider>
            <Preloader />
            <Toaster position="top-center" richColors />
            <AuthInitializer>{children}</AuthInitializer>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
