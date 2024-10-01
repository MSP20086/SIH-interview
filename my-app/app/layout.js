"use client";

import "./css/style.css";
import { Inter } from "next/font/google";
import { UserProvider, useUser } from "@/app/context/user";
import Header from "@/components/ui/header";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from 'react-hot-toast'; // Import Toaster for toast notifications
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

            <ProgressBar
              height="3px"
              color="#30B8E2"
              options={{ showSpinner: false }}
              shallowRouting
            />
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            <ContentWrapper>

              <Toaster 
                position="top-center"
                reverseOrder={false}
              />
              {children}
            </ContentWrapper>
          </div>
        </body>
      </html>
    </UserProvider>
  );
}

function ContentWrapper({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = router.pathname || '';

  if (user) {
    console.log(user.role)
  }

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/signin');
  //   } else if (user.role === 'candidate') {
  //     if (pathname !== '/' && !pathname.startsWith('/?id=')) {
  //       router.push('/');
  //     }
  //   } else if (user.role === 'expert') {
  //     if (pathname !== '/dashboard') {
  //       router.push('/dashboard');
  //     }
  //   }
  // }, [user, pathname, router]);

  return <>{children}</>;
}
