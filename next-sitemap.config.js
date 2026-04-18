/** @type {import('next-sitemap').IConfig} */

async function getAllBlogSlugs() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${API}/blog/get-published-blogs`);

    if (!res.ok) return [];

    const data = await res.json();

    if (data && data.blogs && Array.isArray(data.blogs)) {
      // ✅ Date ke hisaab se sort karo (latest first)
      const sortedBlogs = data.blogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      return sortedBlogs.map((blog) => ({
        slug: blog.slug,
        createdAt: blog.createdAt,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }
}

module.exports = {
  siteUrl: "https://sanika-blogs.vercel.app",
  outDir: "./public",
  generateRobotsTxt: false,

  exclude: ["/dashboard/*", "/api/*", "/login", "/signUp", "/searchList/*"],

  additionalPaths: async () => {
    const blogs = await getAllBlogSlugs();

    // ✅ Har blog ki priority uski date ke hisaab se
    return blogs.map((blog, index) => {
      // Latest 5 blogs ko highest priority
      let priority = 0.8; // default
      let changefreq = "weekly";

      if (index < 10) {
        priority = 1.0; // ✅ Latest 10 blogs - Highest priority
        changefreq = "hourly"; // ✅ hourly crawl
      } else if (index < 20) {
        priority = 1.0; // ✅ Latest 20 blogs - Highest priority
        changefreq = "daily"; // ✅ Daily crawl
      } else if (index < 40) {
        priority = 0.9; // ✅ Next 40 blogs - High priority
        changefreq = "daily";
      } else {
        priority = 0.8; // ✅ Old blogs - Normal priority
        changefreq = "weekly";
      }

      return {
        loc: `/blog/${blog.slug}`,
        changefreq: changefreq,
        priority: priority,
        lastmod: blog.createdAt || new Date().toISOString(),
      };
    });
  },

  transform: async (config, path) => {
    // Homepage - Highest priority
    if (path === "/") {
      return { loc: path, priority: 1.0, changefreq: "daily" };
    }

    // Blog pages - Already handled in additionalPaths
    if (path.startsWith("/blog/")) {
      return { loc: path, priority: 0.9, changefreq: "daily" };
    }

    // About page - Low priority
    if (path === "/about") {
      return { loc: path, priority: 0.5, changefreq: "monthly" };
    }

    return { loc: path, priority: 0.5, changefreq: "monthly" };
  },
};
