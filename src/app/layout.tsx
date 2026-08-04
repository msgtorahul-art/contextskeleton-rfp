import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextSkeleton RFP - Autonomous Bid Proposal Engine",
  description: "Generate compliant, grounded B2B tender and RFP responses automatically from your historic company documentation.",
  metadataBase: new URL("https://contextskeleton.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
