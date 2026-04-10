"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedBlogs } from "@/redux/blogSlice";

const Blogs = () => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { publishedBlogs } = useSelector((state) => state.blog);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch blogs when component mounts
  useEffect(() => {
    dispatch(fetchPublishedBlogs());
  }, [dispatch]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  // Helper function to get author name from object or string
  // Get author initials
  const getInitials = (name) => {
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

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="h-16 md:h-20 text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Our Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the latest insights, stories, and updates from our team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs && publishedBlogs.length > 0 ? (
            publishedBlogs.map((blog, index) => (
              <div
                key={blog._id || blog.id}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(blog._id || blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Blog Image with overlay */}
                  {blog.thumbnail && blog.thumbnail !== "" && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={blog?.thumbnail}
                        alt={blog?.title || "Blog thumbnail"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        width={80}
                        height={48}
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
                              blog.author?.firstName + blog.author?.lastName ||
                                "A",
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {`${blog.author?.firstName} ${blog.author?.lastName}` ||
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
                          {formatDate(blog.createdAt) ||
                            formatDate(blog.publishedAt) ||
                            "21 May 2025"}
                        </span>
                      </div>
                    </div>

                    {/* Blog Title with hover effect */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      <Link
                        href={`/blog/${blog.slug || blog._id || blog.id}`}
                        className="hover:underline"
                      >
                        {blog.title}
                      </Link>
                    </h2>

                    {/* Subtitle/Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 text-sm leading-relaxed">
                      {blog.subtitle ||
                        blog.excerpt ||
                        blog.description ||
                        "Discover the latest insights and expert tips in this comprehensive guide."}
                    </p>

                    {/* Read More Link with arrow animation */}
                    <a
                      href={`/blog/${blog.slug || blog._id || blog.id}`}
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
                    </a>

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
            ))
          ) : (
            // Enhanced empty state with animation
            <div className="col-span-full text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No blogs yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Stay tuned! Exciting content is coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add these styles to your global CSS or create a new CSS module */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default Blogs;
