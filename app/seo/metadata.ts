import merge from "lodash.merge";
import type { Metadata } from "next";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
};

const applicationName = "SystemStudio";
const defaultDescription = "Practice and master system design with real-world challenges. Join a community of developers learning system design together.";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_WEB_URL || "https://systemstudio.com";
const author: Metadata["authors"] = {
  name: "SystemStudio Team",
  url: siteUrl,
};
const publisher = "SystemStudio";
const twitterHandle = "@systemstudio";

// Helper to get absolute URL
const getAbsoluteUrl = (path: string = ""): string => {
  const url = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return url;
};

// Default OG image
const defaultImage = getAbsoluteUrl("/opengraph-image.png");

export const createMetadata = ({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors: customAuthors,
  keywords,
  noindex = false,
  nofollow = false,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const fullUrl = url ? getAbsoluteUrl(url) : siteUrl;
  const ogImage = image ? getAbsoluteUrl(image) : defaultImage;
  const metaDescription = description || defaultDescription;
  
  const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: parsedTitle,
      template: `%s | ${applicationName}`,
    },
    description: metaDescription,
    applicationName,
    authors: customAuthors ? customAuthors.map(name => ({ name })) : [author],
    creator: author.name,
    publisher,
    keywords: keywords ? keywords.join(", ") : undefined,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: applicationName,
    },
    openGraph: {
      type,
      title: parsedTitle,
      description: metaDescription,
      url: fullUrl,
      siteName: applicationName,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: customAuthors || [author.name],
        section: "System Design",
        tags: keywords,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: parsedTitle,
      description: metaDescription,
      creator: twitterHandle,
      site: twitterHandle,
      images: [ogImage],
    },
    verification: {
      // Add your verification codes here when available
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // yahoo: "your-yahoo-verification-code",
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  return metadata;
};

// Helper function to generate metadata for challenge pages
export const createChallengeMetadata = (challenge: {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
}): Metadata => {
  const description = challenge.description.length > 160
    ? `${challenge.description.substring(0, 157)}...`
    : challenge.description;

  return createMetadata({
    title: challenge.title,
    description: `System design challenge: ${challenge.title}. ${description}`,
    url: `/challenges/${challenge.id}`,
    type: "article",
    publishedTime: challenge.createdAt,
    modifiedTime: challenge.updatedAt,
    keywords: [
      "system design",
      "system architecture",
      challenge.difficulty.toLowerCase(),
      ...challenge.tags.map(tag => tag.toLowerCase()),
      "software engineering",
      "distributed systems",
    ],
  });
};

// Helper function to generate metadata for solution pages
export const createSolutionMetadata = (solution: {
  challenge: {
    title: string;
    id: string;
  };
  description: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}): Metadata => {
  const authorName = solution.user
    ? `${solution.user.firstName || ""} ${solution.user.lastName || ""}`.trim()
    : "Anonymous";
  
  const description = solution.description.length > 160
    ? `${solution.description.substring(0, 157)}...`
    : solution.description;

  return createMetadata({
    title: `Solution: ${solution.challenge.title}`,
    description: `System design solution for ${solution.challenge.title}. ${description}`,
    url: `/challenges/${solution.challenge.id}/solutions/${solution.id}`,
    type: "article",
    publishedTime: solution.createdAt,
    modifiedTime: solution.updatedAt,
    authors: [authorName],
    keywords: [
      "system design",
      "solution",
      "architecture",
      solution.challenge.title.toLowerCase(),
      "software engineering",
    ],
  });
};

// Default metadata for the root layout
export const defaultMetadata: Metadata = createMetadata({
  title: "SystemStudio - Master System Design",
  description: defaultDescription,
  url: "/",
  keywords: [
    "system design",
    "system architecture",
    "software engineering",
    "distributed systems",
    "coding challenges",
    "technical interview",
    "system design practice",
  ],
});
