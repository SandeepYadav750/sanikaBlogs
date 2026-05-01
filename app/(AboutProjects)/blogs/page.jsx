// app/blog/page.js
import Blogs from "./BlogsClient";

const FRONT_API = "https://sanika-blogs.vercel.app";

// ✅ Ye metadata server par generate hoga — Facebook/Google dono ke liye kaam karega
export const metadata = {
  title: "All Blogs - Sanika Blogs",
  description:
    "Browse all blog posts on web development, AI, digital marketing, UI/UX design, and more.",
  keywords:
    "all blogs, blog listing, tech articles, programming blogs, web development, AI, digital marketing",
  openGraph: {
    title: "All Blogs - Sanika Blogs",
    description:
      "Browse all blog posts on web development, AI, digital marketing, UI/UX design, and more.",
    url: FRONT_API + "/blogs",
    siteName: "Sanika Blogs",
    images: [
      {
        url: FRONT_API + "/og-blogs.png",
        width: 1200,
        height: 630,
        alt: "Sanika Blogs - All Blogs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Blogs - Sanika Blogs",
    description:
      "Browse all blog posts on web development, AI, digital marketing, UI/UX design, and more.",
    images: [FRONT_API + "/og-blogs.png"],
  },
  alternates: {
    canonical: FRONT_API + "/blogs",
  },
};

export default function BlogsPage() {
  // Tumhara existing client component yaha render hoga
  return <Blogs />;
}
