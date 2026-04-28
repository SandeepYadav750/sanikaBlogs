// app/sitemap.xml/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const response = await axios.get(`${API}/blog/get-published-blogs`, {
      withCredentials: false,
      timeout: 10000,
    });

    const blogs = response.data?.blogs || [];
    const currentDate = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
              xmlns:xhtml="http://www.w3.org/1999/xhtml" 
              xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
              xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        <!-- Homepage -->
        <url>
          <loc>https://sanika-blogs.vercel.app/</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        
        <!-- Blogs About -->
        <url>
          <loc>https://sanika-blogs.vercel.app/about</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>

        <!-- Blogs SEARCHLIST -->
        <url>
          <loc>https://sanika-blogs.vercel.app/searchList</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>

        <!-- Blogs Listing -->
        <url>
          <loc>https://sanika-blogs.vercel.app/blogs</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>

        <!-- All Blog Posts -->
        ${blogs.map((blog) => `
        <url>
          <loc>https://sanika-blogs.vercel.app/blog/${blog.slug}</loc>
          <lastmod>${blog.updatedAt ? new Date(blog.updatedAt).toISOString() : currentDate}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
          ${
            blog.thumbnail
              ? `<image:image>
            <image:loc>${blog.thumbnail}</image:loc>
            <image:title>${blog.title || "Blog Image"}</image:title>
          </image:image>`
              : ""
          }
        </url>
        `,
          )
          .join("")}
      </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "text/xml",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
              xmlns:xhtml="http://www.w3.org/1999/xhtml" 
              xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
              xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        <url>
          <loc>https://sanika-blogs.vercel.app/</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      </urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}
