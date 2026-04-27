/** @type {import('next-sitemap').IConfig} */

const axios = require("axios");

async function getAllBlogSlugs() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await axios.get(`${API}/blog/get-published-blogs`, {
      withCredentials: false,
    });

    if (res.data && res.data.blogs && Array.isArray(res.data.blogs)) {
      const sortedBlogs = res.data.blogs.sort(
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
  
  // ✅ IMPORTANT: 50,000 se upar rakho taaki split na ho
  sitemapSize: 50000,
  
  // ✅ Yeh ensure karega ki sirf EK file bane
  generateIndexSitemap: false,  // ← YEH LINE ADD KARO (most important!)
  
  // ✅ Sirf yeh paths exclude karo
  exclude: [
    "/dashboard/*", 
    "/api/*", 
    "/login", 
    "/signUp", 
    "/searchList/*",
    "/_not-found"  // add this too
  ],

  additionalPaths: async () => {
    const blogs = await getAllBlogSlugs();
    console.log(`📝 Found ${blogs.length} blogs for sitemap`);

    return blogs.map((blog, index) => {
      let priority = 0.8;
      let changefreq = "weekly";

      if (index < 10) {
        priority = 1.0;
        changefreq = "daily";  // "hourly" se "daily" karo (Google hourly ignore karta hai)
      } else if (index < 20) {
        priority = 1.0;
        changefreq = "daily";
      } else if (index < 40) {
        priority = 0.9;
        changefreq = "daily";
      } else {
        priority = 0.8;
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

  // ✅ Transform default paths (already handled)
  transform: async (config, path) => {
    if (path === "/") {
      return { 
        loc: path, 
        priority: 1.0, 
        changefreq: "daily",
        lastmod: new Date().toISOString()
      };
    }

    if (path === "/about") {
      return { 
        loc: path, 
        priority: 0.5, 
        changefreq: "monthly",
        lastmod: new Date().toISOString()
      };
    }

    if (path === "/blogs") {
      return { 
        loc: path, 
        priority: 0.9, 
        changefreq: "daily",
        lastmod: new Date().toISOString()
      };
    }

    return { 
      loc: path, 
      priority: 0.5, 
      changefreq: "monthly",
      lastmod: new Date().toISOString()
    };
  },
};