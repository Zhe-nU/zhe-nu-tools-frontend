import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { Metadata } from "next"
import { Toaster } from "sonner"
import { cn } from "@/shared/lib/tailwind/utils"
import { TooltipProvider } from "@/shared/ui/tooltip"
import QueryProviders from "../src/shared/ui/providers/query-provider"
import { ThemeProvider } from "../src/shared/ui/providers/theme-provider"
import { FormDevtoolsProvider } from "@/shared/lib/form-devtools"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Zhe_nU Tools",
  description: "...",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <Toaster />
        <ThemeProvider>
          <TooltipProvider>
            <QueryProviders>{children}</QueryProviders>
          </TooltipProvider>
        </ThemeProvider>
        <FormDevtoolsProvider />
      </body>
    </html>
  )
}
