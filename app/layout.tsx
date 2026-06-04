import type { Metadata } from "next";
import "./globals.css";

const siteTitle = "Woodhouse Realty Blog";
const siteDescription =
  "Real estate insights, buying guidance, and selling strategy from Woodhouse Realty in Surrey, British Columbia.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`
  },
  description: siteDescription,
  metadataBase: new URL("https://www.stonegroup.ca"),
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Woodhouse Realty",
    type: "website",
    images: [
      {
        url: "/files/themeManager/16663/theme18/woodhouse transparent background.png",
        width: 1200,
        height: 630,
        alt: "Woodhouse Realty"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
