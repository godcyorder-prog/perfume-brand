import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { CartLink } from "@/components/cart-link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
export const metadata: Metadata = { title: "Coyilo — Choose your fragrance", description: "Find your signature scent with Coyilo." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="en" className={`${inter.variable} ${playfair.variable}`}><body><CartProvider><CartLink />{children}</CartProvider></body></html>; }
