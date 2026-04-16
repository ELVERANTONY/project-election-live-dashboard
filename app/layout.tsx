import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "¿Aliaga pasa a Sánchez? | Primera Vuelta 2026",
  description: "Cuántos votos le faltan a Rafael López Aliaga para superar a Sánchez y consolidar el segundo lugar. Actualización en tiempo real — ONPE.",
  openGraph: {
    title: "¿Aliaga pasa a Sánchez? | Primera Vuelta 2026",
    description: "Cuántos votos le faltan a Rafael López Aliaga para superar a Sánchez y consolidar el segundo lugar. Actualización en tiempo real — ONPE.",
    siteName: "¿Aliaga pasa a Sánchez?",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Aliaga pasa a Sánchez? | Primera Vuelta 2026",
    description: "Cuántos votos le faltan a Rafael López Aliaga para superar a Sánchez y consolidar el segundo lugar. Actualización en tiempo real — ONPE.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`dark ${spaceGrotesk.variable} ${workSans.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌞</text></svg>" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
