import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jaxicloud Fleet | Vehicle Safety & Telematics",
    template: "%s | Jaxicloud Fleet",
  },
  description:
    "B2B fleet hardware catalog — cameras, trackers, tablets, and sensors rebranded as integrated Jaxicloud vehicle solutions.",
  openGraph: {
    type: "website",
    siteName: "Jaxicloud Fleet",
    title: "Jaxicloud Fleet",
    description:
      "Integrated vehicle cameras, trackers, tablets, and sensors for commercial fleets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        {gaId ? (
          <>
            {/* GA4 placeholder — set NEXT_PUBLIC_GA_ID to enable */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
