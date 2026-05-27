import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styles.css";

export const metadata: Metadata = {
  title: "Elegant - Premium Products",
  description: "Discover our curated collection of premium products. Quality and craftsmanship in every detail.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23b87333'/><text x='50%' y='55%' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='sans-serif' font-weight='bold'>E</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-[80%] mx-auto antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
