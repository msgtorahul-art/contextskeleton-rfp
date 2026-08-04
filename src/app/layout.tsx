import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextSkeleton | Autonomous RFP Engine & Enterprise Vector Hub",
  description: "Automate B2B tender proposals, RFIs, and security questionnaires with grounded AI RAG vector search and 1-click Microsoft Word (.docx) export.",
  metadataBase: new URL("https://contextskeleton.com"),
  keywords: [
    "RFP Automation", "Tender Software", "B2B Proposal Generator", 
    "AI Vector Search", "RAG Engine", "Security Questionnaire Automation", 
    "Word Exporter", "ContextSkeleton", "Enterprise AI"
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
    title: "ContextSkeleton | Autonomous RFP Engine & Enterprise Vector Hub",
    description: "Draft 100-page tender questionnaires in minutes grounded in verified facts. Exports formatted Microsoft Word (.docx) documents.",
    images: [
      {
        url: "https://contextskeleton.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ContextSkeleton RFP Engine & Vector RAG Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContextSkeleton | Autonomous RFP Engine",
    description: "Automate B2B tender proposals with grounded RAG vector search & Word export.",
    images: ["https://contextskeleton.com/og-image.png"],
    creator: "@contextskeleton",
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
      "highPrice": "499",
      "offerCount": "2"
    },
    "description": "Autonomous RFP & Tender Response Engine powered by Grounded AI Vector Search and Microsoft Word Exporter.",
    "url": "https://contextskeleton.com"
  };

  return (
    <html lang="en" className="dark scroll-smooth">
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
