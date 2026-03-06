import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatProvider } from "@/components/chat/ChatContext";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatPanel } from "@/components/chat/ChatPanel";

/** Elegant display serif – close stand-in for Sauvage Serif (Art Deco–inspired, high-contrast headlines). */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

/** Body and nav – clean, readable sans (avoids typewriter feel of mono). Use mono only for pricing/menus. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

/** Reserved for pricing, balloon menu, product specs per brand board – not default body. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const madisonSauvageScript = localFont({
  src: "../Madison Sauvage Script.otf",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party Barn Mercantile | Rooted in Celebration",
  description:
    "A modern party studio offering premium balloons, curated party goods, and stylish gifts in Old Town Murrieta. Thoughtful event styling with a clean, elevated aesthetic.",
  openGraph: {
    title: "Party Barn Mercantile | Rooted in Celebration",
    description:
      "Premium balloons, curated party goods, and event styling in Old Town Murrieta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${madisonSauvageScript.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ChatProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatButton />
          <ChatPanel />
        </ChatProvider>
      </body>
    </html>
  );
}
