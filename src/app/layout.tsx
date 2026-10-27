import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { fetchRows, fetchKpis } from "@/lib/data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

async function getNavBadges() {
  try {
    const [{ kpis }, payments] = await Promise.all([
      fetchKpis(),
      fetchRows("payments", { where: { status: "needs_verification" } }),
    ]);
    return {
      inbox: kpis.hotLeads,
      payments: payments.rows.length,
      disputes: kpis.openDisputes,
      attention: kpis.hotLeads + payments.rows.length + kpis.openDisputes,
    };
  } catch {
    return { inbox: 0, payments: 0, disputes: 0, attention: 0 };
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://beyondstyle.ae";
const TITLE = "Beyond Style UAE · Order Control Console";
const DESCRIPTION =
  "UAE social-commerce sales operating console. Owner-approved replies, live orders, delivery and margin in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: TITLE, template: "%s · Beyond Style UAE" },
  description: DESCRIPTION,
  applicationName: "Beyond Style UAE",
  authors: [{ name: "Beyond Connect General Trading L.L.C." }],
  keywords: [
    "Beyond Style UAE", "social commerce", "United Arab Emirates",
    "order control", "customer conversion", "WhatsApp commerce",
    "Instagram DM sales", "operator console", "منصة تجارة",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Beyond Style",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    url: APP_URL,
    siteName: "Beyond Style UAE",
    images: [{ url: "/logo.svg", width: 420, height: 96, alt: "Beyond Style UAE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo.svg"],
  },
  robots: { index: false, follow: false },
  alternates: { canonical: APP_URL, languages: { "en-AE": APP_URL, "ar-AE": APP_URL } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6F0" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A0A0A" },
  ],
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Beyond Style UAE Order Control Console",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Android, iOS",
  offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
  publisher: {
    "@type": "Organization",
    name: "Beyond Connect General Trading L.L.C.",
    address: { "@type": "PostalAddress", addressCountry: "AE" },
  },
  inLanguage: ["en-AE", "ar-AE"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const badges = await getNavBadges();
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="application-name" content="Beyond Style UAE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});}",
          }}
        />
      </head>
      <body className="font-sans">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 border-r border-cream/50 bg-white md:block">
            <Nav badges={badges} />
          </aside>
          <main className="min-w-0 flex-1 p-4 md:p-8">
            <div className="md:hidden mb-3">
              <Nav mobile badges={badges} />
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
