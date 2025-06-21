'use client'
import "./globals.css";
import { LayoutWrapper } from "@/app/layout/LayoutWrapper";
import { Poppins } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={poppins.className}>
          <Provider store={store}>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster richColors />
          </Provider>
      </body>
    </html>
  );
}
