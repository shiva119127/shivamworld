import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioState";
import { AudioController } from "@/components/AudioController";

export const metadata: Metadata = {
  title: "Shivam's World - Interactive Game-Based Portfolio",
  description: "Enter the digital world of Shivam Singh. An immersive, game-menu inspired portfolio showcasing full-stack projects, coding milestones, and creator platforms.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased dark">
      <body className="bg-background text-text-primary h-full w-full overflow-hidden select-none">
        <PortfolioProvider>
          <AudioController />
          <main className="w-full h-full min-h-screen relative overflow-hidden bg-background">
            {children}
          </main>
        </PortfolioProvider>
      </body>
    </html>
  );
}
