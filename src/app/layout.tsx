import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContextSkeleton | Unified Autonomous AI Compliance Platform",
  description: "Specialized autonomous AI products for B2B RFP tenders, NZBC building consent, SOC 2 / ISO 27001 security, FDA 510(k) MedTech, ISO 9001 quality, SOX 404 financial controls, R&D tax credits, ESG climate, clinical trials, GDPR/HIPAA privacy, AML/KYC, and OSHA workplace safety.",
  metadataBase: new URL("https://contextskeleton.com"),
  keywords: [
    "Autonomous AI Platform", "RFP Automation", "NZBC Building Consent", 
    "SOC 2 Security Questionnaires", "FDA 510(k) MedTech", "ISO 9001 AS9100 Quality Auditor",
    "SOX 404 Financial Controls", "R&D Tax Credit Analyzer", "EU CSRD Climate Auditor", 
    "Clinical Trial Protocol", "GDPR HIPAA DPIA", "AML KYC Risk Auditor",
    "OSHA EHS Workplace Safety", "Vector RAG", "ContextSkeleton"
  ],
  authors: [{ name: "ContextSkeleton Team", url: "https://contextskeleton.com" }],
  creator: "ContextSkeleton",
  publisher: "ContextSkeleton",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://contextskeleton.com",
    siteName: "ContextSkeleton",
    title: "ContextSkeleton | Unified Autonomous AI Compliance Platform",
    description: "Specialized autonomous AI solutions for enterprise compliance, legal disclosures, financial audits, security controls, and regulatory engineering.",
    images: [
      {
        url: "https://contextskeleton.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ContextSkeleton Enterprise AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContextSkeleton | Unified Autonomous AI Platform",
    description: "Specialized autonomous AI solutions for enterprise compliance, legal disclosures, financial controls, and regulatory engineering.",
    images: ["https://contextskeleton.com/og-image.png"],
  },
  alternates: {
    canonical: "https://contextskeleton.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ContextSkeleton",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "999",
      "offerCount": "14"
    },
    "description": "Unified Autonomous AI Compliance Platform providing independent solutions for B2B RFP proposals, building consents, security audits, FDA 510(k), ISO 9001 quality, SOX 404 controls, R&D tax, ESG climate, clinical trials, GDPR/HIPAA privacy, AML/KYC, and OSHA workplace safety.",
    "url": "https://contextskeleton.com"
  };

  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
