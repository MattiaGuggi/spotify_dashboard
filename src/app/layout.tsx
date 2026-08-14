import type { Metadata } from "next";
import { UserProvider } from "../context/UserContext";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotify Dashboard",
  description: "Reorder and manage your Spotify playlists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black antialiased overflow-x-hidden min-h-screen" suppressHydrationWarning>
        <UserProvider>
          <div className="relative min-h-screen w-full">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none z-0" />
            <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Floating Glass Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="relative z-10 pt-24 pb-16">
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}