import Hero from "@/components/Hero";
import RecentBlogs from "@/components/RecentBlogs";
import PopularAuthors from "../components/PopularAuthors";

export const metadata = {
  title: "Sanika Blogs - Read Latest Tech Blogs & Articles",
  description:
    "Discover insightful blogs on web development, AI, digital marketing, and more. Join Sanika Blogs community of writers and readers.",
  keywords:
    "blogs, tech blogs, web development, AI, digital marketing, programming",
  authors: [{ name: "Sanika Blogs" }],
  openGraph: {
    title: "Sanika Blogs - Read Latest Tech Blogs & Articles",
    description:
      "Discover insightful blogs on web development, AI, digital marketing, and more.",
    url: "https://sanika-blogs.vercel.app/",
    siteName: "Sanika Blogs",
    images: [
      {
        // url: "https://sanika-blogs.vercel.app/og-home.png",
        width: 1200,
        height: 630,
        alt: "Sanika Blogs Homepage",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanika Blogs - Read Latest Tech Blogs",
    description: "Discover insightful blogs on tech, AI, and more.",
    // images: ["https://sanika-blogs.vercel.app/og-home.png"],
  },
  alternates: {
    canonical: "https://sanika-blogs.vercel.app/",
  },
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen ">
        <Hero />
        <RecentBlogs />
        <PopularAuthors />
      </div>
    </>
  );
}
