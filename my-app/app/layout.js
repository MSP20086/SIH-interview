"use client"

import "./css/style.css";

import { Inter } from "next/font/google";
import { UserProvider, useUser } from "@/app/context/user"
import Header from "@/components/ui/header";
import Banner from "@/components/banner";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body
          className={`${inter.variable} font-inter antialiased bg-white text-gray-900 tracking-tight`}
        >
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            <ContentWrapper>
              {children}
            </ContentWrapper>
            <Banner />
          </div>
        </body>
      </html>
    </UserProvider>
  );
}

function ContentWrapper({ children }) {
  // const { user } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!user && router.pathname !== '/') {
  //     router.push('/signin');
  //   }
  // }, [user, router]);

  return <>{children}</>;
}
