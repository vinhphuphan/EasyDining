import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Header from "@/components/header/Header"
import { CreateOrderModalProvider } from "@/context/CreateOrderModalProvider"
import CreateOrderModalRenderer from "@/components/modals/create-order-modal-renderer"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { AuthProvider } from "@/context/AuthContext";
import { ReduxProvider } from "@/components/providers/ReduxProvider";


export const metadata: Metadata = {
  title: "EasyDining - Dashboard",
  description: "Cloud-based restaurant management system to simplify your work",
  icons: {
    icon: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ReduxProvider>
          <ErrorBoundary>
            <AuthProvider>
              <CreateOrderModalProvider>
                <Header />
                <Suspense fallback={null}>{children}</Suspense>
                <CreateOrderModalRenderer />
              </CreateOrderModalProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ReduxProvider>
        <Toaster
          theme="system"
          richColors
          position="top-center"
          duration={1000}
          toastOptions={{
            classNames: {
              toast: "bg-card text-foreground border border-input shadow-sm",
              title: "font-medium",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-foreground",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}