import "./styles.css";
import { DesignSystemProvider } from "@/app/design-system";
import { fonts } from "@/app/design-system/lib/fonts";
import { defaultMetadata } from "@/app/seo/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = defaultMetadata;

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html className={fonts} lang="en" suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    </head>
    <body>
        <DesignSystemProvider
          helpUrl={process.env.NEXT_PUBLIC_DOCS_URL}
          privacyUrl={new URL(
            "/legal/privacy",
            process.env.NEXT_PUBLIC_WEB_URL
          ).toString()}
          termsUrl={new URL("/legal/terms", process.env.NEXT_PUBLIC_WEB_URL).toString()}
        >
          {children}
        </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
