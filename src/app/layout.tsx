import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Stress Reducer - Transform Your Stress into Inner Peace",
    template: "%s | AI Stress Reducer"
  },
  description: "Experience personalized stress management through AI-powered assessments, compassionate chat support, and delightful 3D companions. Start your journey to mental wellness today.",
  keywords: [
    "stress management",
    "mental health",
    "AI therapy",
    "anxiety relief",
    "depression support",
    "mindfulness",
    "DASS-21 assessment",
    "AI chat assistant",
    "3D wellness companions"
  ],
  authors: [{ name: "AI Stress Reducer Team" }],
  creator: "AI Stress Reducer",
  publisher: "AI Stress Reducer",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.aistressreducer.com",
    title: "AI Stress Reducer - Transform Your Stress into Inner Peace",
    description: "Experience personalized stress management through AI-powered assessments, compassionate chat support, and delightful 3D companions.",
    siteName: "AI Stress Reducer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Stress Reducer - Mental Wellness Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Stress Reducer - Transform Your Stress into Inner Peace",
    description: "Experience personalized stress management through AI-powered assessments, compassionate chat support, and delightful 3D companions.",
    images: ["/twitter-image.png"],
    creator: "@aistressreducer"
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        type: "image/svg+xml"
      }
    ]
  },
  manifest: "/manifest.json",
  themeColor: "#8b7355",
  colorScheme: "light",
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8b7355",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.supabase.co" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Stress Reducer",
              "description": "AI-powered stress management platform with personalized assessments, chat support, and 3D wellness companions",
              "url": "https://www.aistressreducer.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "DASS-21 stress assessment",
                "AI-powered chat support",
                "3D wellness companions",
                "Personalized recommendations",
                "Progress tracking"
              ]
            })
          }}
        />

        {/* Analytics placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-bronze text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>

        <div id="main-content">
          {children}
        </div>

        {/* Error boundary fallback UI */}
        <div id="error-boundary" className="hidden">
          <div className="min-h-screen flex items-center justify-center bg-cream-bg">
            <div className="card max-w-md text-center">
              <h1 className="text-2xl font-bold text-dark-brown mb-4">
                Something went wrong
              </h1>
              <p className="text-text-brown mb-6">
                We apologize for the inconvenience. Please refresh the page or try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
