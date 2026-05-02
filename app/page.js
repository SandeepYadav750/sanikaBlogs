import Hero from "@/components/Hero";
import RecentBlogs from "@/components/RecentBlogs";
import PopularAuthors from "../components/PopularAuthors";

const FRONT_API = "https://www.sanikablogs.com";

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
    url: FRONT_API,
    siteName: "Sanika Blogs",
    images: [
      {
        // url: FRONT_API,
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
    // images: [FRONT_API],
  },
  alternates: {
    canonical: FRONT_API,
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
