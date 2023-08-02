"use client";

import "./globals.scss";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { endpoints } from "@/constants/endpoints";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // default: true
    },
  },
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import("preline");
  }, []);

  const pathname = usePathname();
  const showNavbar =
    pathname !== "/auth/signin" &&
    pathname !== "/auth/verify-request" &&
    pathname !== "/auth/new-user";
  const showFooter = pathname !== "/auth/signin" &&
    pathname !== "/auth/verify-request" &&
    pathname !== "/auth/new-user" && pathname !== "/admin/dashboard";
  const showSidebar = pathname === endpoints.PAGE.adminDashboard()

  return (
    <html lang="en" className={`h-full ${inter.className}`}>
      <body
        className={` dark:bg-slate-900 flex flex-col min-h-full ${!showNavbar && "bg-gray-100 justify-center items-center py-16"
          }`}
      >
        <Providers>
          <QueryClientProvider client={queryClient}>
            {showNavbar && <Navbar />}
            {showSidebar && <Sidebar pathname={pathname} />}
            {children}
            {showFooter && <Footer />}
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}
