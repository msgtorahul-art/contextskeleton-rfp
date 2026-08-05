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
  title: "ContextSkeleton | Autonomous AI Platform for Enterprise Compliance & RFPs",
  description: "Specialized autonomous AI products for B2B RFP proposals, NZBC building consents, SOC 2/ISO 27001 security, FDA 510(k) MedTech, ISO 9001 quality, SOX 404 financial controls, R&D tax credits, ESG climate, clinical trials, GDPR/HIPAA privacy, AML/KYC, and OSHA workplace safety.",
  metadataBase: new URL("https://contextskeleton.com"),
  keywords: [
    "Autonomous AI Compliance Platform", "RFP Proposal Automation", "NZBC Building Consent AI", 
    "SOC 2 Security Questionnaire Resolver", "FDA 510(k) MedTech Equivalence", "ISO 9001 AS9100 Quality Auditor",
    "SOX 404 ICFR Financial Auditor", "R&D Tax Credit Technical Defense", "EU CSRD Scope 1 2 3 Climate Auditor", 
    "Clinical Trial Eligibility Resolver", "GDPR Article 35 DPIA Resolver", "AML KYC PEP Sanctions Auditor",
    "OSHA 1910 EHS Safety Auditor", "Enterprise Vector RAG Storage", "ContextSkeleton"
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
  // Rich Structured Schema.org Data for Search Engines & Rich Snippets
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ContextSkeleton Autonomous AI Platform",
    "operatingSystem": "All Cloud & Web Platforms",
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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ContextSkeleton",
    "url": "https://contextskeleton.com",
    "logo": "https://contextskeleton.com/og-image.png",
    "email": "support@contextskeleton.com",
    "sameAs": [
      "https://github.com/msgtorahul-art/contextskeleton-rfp"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ContextSkeleton?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ContextSkeleton is a unified autonomous AI platform providing 14 specialized products for B2B RFP proposals, building consents, security audits, FDA 510(k) MedTech, ISO 9001 quality, SOX 404 financial controls, R&D tax credits, and ESG climate reporting."
        }
      },
      {
        "@type": "Question",
        "name": "How does ContextSkeleton prevent AI hallucinations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ContextSkeleton uses isolated vector database storage and strict Retrieval-Augmented Generation (RAG). Answers are generated strictly from uploaded company documents with source citations, and the system explicitly refuses to guess when no supporting policy document exists."
        }
      },
      {
        "@type": "Question",
        "name": "How much does ContextSkeleton cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ContextSkeleton offers transparent monthly product subscriptions ranging from $299/mo to $999/mo per product tier, plus a 100% free LLM Token Skeletonizer developer utility."
        }
      }
    ]
  };

  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
