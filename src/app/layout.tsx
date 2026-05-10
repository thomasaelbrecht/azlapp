import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

export const metadata: Metadata = {
  title: "AZL app",
  description: "Applicatie ter ondersteuning van de lesgevers van AZL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} ${geistMono.className} antialiased`}>
        <NuqsAdapter>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
