'use client'
import "./globals.css";
import { LayoutWrapper } from "@/app/layout/LayoutWrapper";
import { Roboto } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from "sonner";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
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
