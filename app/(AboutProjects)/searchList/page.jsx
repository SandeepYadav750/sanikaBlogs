"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const SearchList = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { blogs } = useSelector((store) => store.blog);

  const filterBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(query) ||
      blog.subtitle?.toLowerCase().includes(query) ||
      blog.category?.toLowerCase() === query?.toLowerCase(),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Get author initials
  const getInitials = (firstName, lastName) => {
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get category color based on category name
  const getCategoryColor = (category) => {
    const colors = {
      "Digital Marketing":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Web Development":
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Web Application":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Technology:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Design:
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Business:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  // Handle case when no search query is provided
  if (!query) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Search Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please enter a search term to find blogs.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Search Page
      </h1>
      <h3 className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Search results for: "{query}"
      </h3>

      {filterBlogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No blogs found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterBlogs.map((blog, index) => {
            // Use _id as the identifier since slug is not available
            const blogId = blog._id || blog.id;
            if (!blogId) return "Loading...";

            return (
              <div
                key={blogId}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Blog Image with overlay */}
                  {blog.thumbnail && blog.thumbnail !== "" && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title || "Blog thumbnail"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        width={400}
                        height={300}
                        unoptimized={true}
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Category badge on image */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}
                        >
                          {blog.category || "Digital Marketing"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {/* Author Avatar */}
                        <Avatar className="h-14 w-14 ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                          <AvatarImage src={blog.author?.photoURL} />
                          <AvatarFallback className="bg-linear-to-r from-indigo-500 to-purple-500 text-white text-lg">
                            {getInitials(
                              blog.author?.firstName,
                              blog.author?.lastName,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {`${blog.author?.firstName || ""} ${blog.author?.lastName || ""}`.trim() ||
                              "Anonymous Author"}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {formatDate(blog.createdAt) || "21 May 2025"}
                        </span>
                      </div>
                    </div>

                    {/* Blog Title with hover effect */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      <Link
                        href={`/blog/${blogId}`}
                        className="hover:underline"
                      >
                        {blog.title}
                      </Link>
                    </h2>

                    {/* Subtitle/Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 text-sm leading-relaxed">
                      {blog.subtitle ||
                        blog.excerpt ||
                        "Discover the latest insights and expert tips in this comprehensive guide."}
                    </p>

                    {/* Read More Link with arrow animation */}
                    <Link
                      href={`/blog/${blogId}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group/link hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
                    >
                      <span className="relative">
                        Read More
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300"></span>
                      </span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover/link:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {/* Reading time indicator (optional) */}
                    {blog.readingTime && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{blog.readingTime} min read</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchList;
