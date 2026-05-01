import { notFound } from "next/navigation";
import BlogClient from "./slugBlogClient";

const FRONT_API = process.env.NEXT_FRONTEND_API_URL;
console.log("FRONT_API", FRONT_API);

// This function fetches the blog on the server
async function getBlogBySlug(slug) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Fetch all published blogs
    const res = await fetch(`${API_URL}/blog/get-published-blogs`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (data.success && data.blogs) {
      // Find the blog with matching slug
      const blog = data.blogs.find((b) => b.slug === slug);
      return blog || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// ✅ FIXED: Make the function async and await params
export async function generateMetadata({ params }) {
  // ✅ Await params before accessing its properties
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  // Clean HTML from description
  const plainText =
    blog.description?.replace(/<[^>]*>/g, "").substring(0, 160) || "";
  const authorName =
    blog.author?.firstName && blog.author?.lastName
      ? `${blog.author.firstName} ${blog.author.lastName}`
      : "Sanika Blogs";

  return {
    title: `${blog.title} | Sanika Blogs`,
    description: plainText,
    keywords: `${blog.category || "blog"}, ${blog.keywords || ""}, blogging, articles, sanika blogs`,
    authors: [{ name: authorName }],
    openGraph: {
      title: blog.title,
      description: plainText,
      url: `${FRONT_API}/blog/${slug}`,
      siteName: "Sanika Blogs",
      images: [
        {
          url: blog.thumbnail || `${FRONT_API}/og-default.png`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [authorName],
      tags: [blog.category],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: plainText,
      images: [blog.thumbnail || `${FRONT_API}/og-default.png`],
      creator: authorName,
    },
    alternates: {
      canonical: `${FRONT_API}/blog/${slug}`,
    },
  };
}

// ✅ FIXED: Make the main component async and await params
export default async function BlogPage({ params }) {
  // ✅ Await params before accessing its properties
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  // If blog not found, show 404
  if (!blog) {
    notFound();
  }

  // Pass the blog data to client component for interactivity
  return <BlogClient initialBlog={blog} />;
}
