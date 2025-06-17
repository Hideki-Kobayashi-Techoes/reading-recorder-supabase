import HeaderAuth from "@/components/header-auth";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SearchBox } from "@/components/SearchBox";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Reading Recorder",
  description: "A reading recorder app built with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background z-10">
              <div className="container flex justify-between items-center px-10 text-sm">
                <div className="flex gap-5 items-center text-xl font-bold">
                  <Link href={"/"}>Reading Recorder</Link>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="w-80">
                    <SearchBox />
                  </div>
                  <HeaderAuth />
                </div>
              </div>
            </nav>
            
            <div className="w-full">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p className="text-muted-foreground">
                © MMXXV Reading Recorder
              </p>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
