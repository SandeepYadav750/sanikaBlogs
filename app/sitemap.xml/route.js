// app/sitemap.xml/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // Force dynamic rendering
export const revalidate = 0; // Disable caching completely

const API = process.env.NEXT_PUBLIC_API_URL;
const FRONT_API = "https://sanika-blogs.vercel.app";

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
          <loc>${FRONT_API}/</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        
        <url>
          <loc>${FRONT_API}/about</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>

        <url>
          <loc>${FRONT_API}/searchList</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>

        <url>
          <loc>${FRONT_API}/blogs</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>

        <!-- All Blog Posts -->
        ${blogs
          .map(
            (blog) => `
        <url>
          <loc>${FRONT_API}/blog/${blog.slug}</loc>
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

    // CRITICAL: Disable caching in production
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "text/xml",
        "Cache-Control": "no-cache, no-store, must-revalidate", // Disable cache
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Don't return fallback - throw error to force fresh generation
    throw new Error(`Sitemap generation failed: ${error.message}`);
  }
}
