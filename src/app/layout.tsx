import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { FunnelProvider } from "@/lib/store";
import { MetaPixel } from "@/components/MetaPixel";
import { OFFER } from "@/config/offer";
import "./globals.css";

// The reference embeds only Nunito (its "SF Pro Rounded" first choice is an Apple system font) and
// declares it with a single `font-weight: 900` face, so outside Apple devices every rounded text is
// rendered at 900. Loading only the 900 face reproduces that rendering exactly.
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["900"], display: "swap" });

export const metadata: Metadata = {
  title: `Plano de treino para Shih Tzu | ${OFFER.brand.name}`,
  description: "Responda ao quiz e receba um plano de treino personalizado para o seu Shih Tzu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>
        <MetaPixel />
        <FunnelProvider>{children}</FunnelProvider>
      </body>
    </html>
  );
}
