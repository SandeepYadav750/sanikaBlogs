// THIS IS A SERVER COMPONENT - Complete SEO implementation
export const dynamic = "force-dynamic";
import { getServerUser } from "@/lib/getServerUser";
import Script from "next/script";
import ProfileClient from "./ProfileClient"; // Your existing client component

// ✅ STEP 1 + STEP 4: Dynamic Metadata + Open Graph + Twitter Cards
export async function generateMetadata() {
  const userData = await getServerUser();
  const user = userData?.user;

  // Guest user (not logged in)
  if (!user) {
    return {
      title: "Profile | Sanika Blogs",
      description: "Login to view and manage your profile on Sanika Blogs",
      robots: "noindex, nofollow",
      openGraph: {
        title: "Profile | Sanika Blogs",
        description: "Login to manage your profile",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Profile | Sanika Blogs",
        description: "Login to manage your profile",
      },
    };
  }

  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const profileUrl = "https://sanika-blogs.vercel.app/dashboard/profile";

  return {
    title: `${displayName} - Profile | Sanika Blogs`,
    description: user.bio || `Profile of ${displayName} on Sanika Blogs`,
    authors: [{ name: displayName, url: profileUrl }],

    // STEP 4: Open Graph (Facebook, LinkedIn, WhatsApp)
    openGraph: {
      title: `${displayName} - Profile`,
      description: user.bio || `View ${displayName}'s profile and blogs`,
      url: profileUrl,
      siteName: "Sanika Blogs",
      images: user.photoURL
        ? [
            {
              url: user.photoURL,
              width: 800,
              height: 600,
              alt: `${displayName}'s profile photo`,
            },
          ]
        : ["/user.jpg"],
      type: "profile",
      profile: {
        username: displayName,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
    },

    // STEP 4: Twitter Cards
    twitter: {
      card: "summary_large_image",
      title: `${displayName} - Profile`,
      description: user.bio || `View ${displayName}'s profile`,
      images: user.photoURL ? [user.photoURL] : ["/user.jpg"],
      creator:
        user.twitter?.replace("https://twitter.com/", "@") || "@sanikablogs",
    },

    // SEO additional
    robots: {
      index: false, // Profile pages shouldn't be indexed
      follow: false,
    },
    alternates: {
      canonical: profileUrl,
    },
  };
}

// ✅ STEP 14: Dynamic Schema Markup (Same page mein)
export default async function ProfilePage() {
  const userData = await getServerUser();
  const user = userData?.user;

  // Schema for logged-in user
  const profileSchema = user
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        description: user.bio,
        url: "https://sanika-blogs.vercel.app/dashboard/profile",
        dateCreated: user.createdAt || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntity: {
          "@type": "Person",
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          image: user.photoURL,
          jobTitle: user.occupation,
          sameAs: [
            user.facebook,
            user.twitter,
            user.linkedin,
            user.instagram,
          ].filter((social) => social && social !== ""),
          description: user.bio,
        },
      }
    : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sanika-blogs.vercel.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profile",
        item: "https://sanika-blogs.vercel.app/dashboard/profile",
      },
    ],
  };

  return (
    <>
      {/* STEP 14: JSON-LD Schema Scripts */}
      {profileSchema && (
        <Script
          id="profile-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
          strategy="afterInteractive"
        />
      )}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />

      {/* Your existing client component */}
      <ProfileClient />
    </>
  );
}
