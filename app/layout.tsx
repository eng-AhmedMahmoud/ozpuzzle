import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk } from "next/font/google";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ozpuzzle.com"),
  title: "OZ Puzzle — Handcrafted Wooden Jigsaw Puzzles",
  description:
    "Wooden jigsaw puzzles cut with love in Egypt. Customized photo puzzles, guest book puzzles, dollhouses and whimsical originals.",
  openGraph: {
    title: "OZ Puzzle — Handcrafted Wooden Jigsaw Puzzles",
    description:
      "Wooden jigsaw puzzles cut with love in Egypt. Customized photo puzzles, guest book puzzles, dollhouses and whimsical originals.",
    url: "https://ozpuzzle.com",
    siteName: "OZ Puzzle",
    images: [
      {
        url: "https://ozpuzzle.com/cdn/shop/files/The_Kiss1.jpg?v=1782209086&width=1200",
        width: 1200,
        height: 800,
      },
    ],
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
      className={`${fraunces.variable} ${schibsted.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col overflow-x-clip">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
