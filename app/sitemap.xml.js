
import axios from "axios";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://sanika-blogs.vercel.app/api";

async function getAllBlogs() {
  try {
    const res = await axios.get(`${API}/blog/get-published-blogs`, {
      withCredentials: false,
    });

    if (res.data.success) {
      return res.data.blogs || [];
    }
    return [];
  } catch (error) {
    console.error("Sitemap fetch error:", error);
    return [];
  }
}

function generateSiteMap(blogs) {
  const currentDate = new Date().toISOString();

  // IMPORTANT PAGES - High priority
  const importantPages = [
    {
      loc: "https://sanika-blogs.vercel.app",
      lastmod: currentDate,
      changefreq: "daily",
      priority: "1.0", // Homepage - highest
    },
    {
      loc: "https://sanika-blogs.vercel.app/dashboard/blogs",
      lastmod: currentDate,
      changefreq: "daily",
      priority: "0.9", // Blog listing - very important
    },
  ];

  // BLOG POSTS - Medium-high priority (kyunki yeh main content hai)
  const blogUrls = blogs.map((blog) => ({
    loc: `https://sanika-blogs.vercel.app/blog/${blog.slug}`,
    lastmod: blog.updatedAt
      ? new Date(blog.updatedAt).toISOString()
      : currentDate,
    changefreq: "daily", // Daily change karo
    priority: "1.0", // 1.0 do taki Google priority samjhe
  }));

  const allUrls = [...importantPages, ...blogUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls
        .map(
          (url) => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `,
        )
        .join("")}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const blogs = await getAllBlogs();
  const sitemap = generateSiteMap(blogs);

  res.setHeader("Content-Type", "text/xml");
  // Cache kam kiya 10 minutes (600 seconds) for faster updates
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=120",
  );

  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
