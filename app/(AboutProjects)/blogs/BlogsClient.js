"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedBlogs } from "@/redux/blogSlice";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";

const Blogs = () => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { publishedBlogs, loading } = useSelector((state) => state.blog);

  // Responsive view mode - automatically switches based on screen size
  const [viewMode, setViewMode] = useState("pagination"); // "pagination" or "infinite"
  const [isMobile, setIsMobile] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Infinite scroll state
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const itemsPerLoad = 10;

  // Fetch blogs when component mounts
  useEffect(() => {
    dispatch(fetchPublishedBlogs());
  }, [dispatch]);

  // Check screen size and set view mode accordingly
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // 768px is md breakpoint
      setIsMobile(mobile);
      setViewMode(mobile ? "infinite" : "pagination");
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Reset states when blogs change or view mode changes
  useEffect(() => {
    setCurrentPage(1);
    setVisibleItems(6);
  }, [publishedBlogs?.length, viewMode]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBlogs =
    publishedBlogs?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((publishedBlogs?.length || 0) / itemsPerPage);

  // Infinite scroll calculations
  const infiniteBlogs = publishedBlogs?.slice(0, visibleItems) || [];
  const hasMore = visibleItems < (publishedBlogs?.length || 0);
  const remainingItems = (publishedBlogs?.length || 0) - visibleItems;

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Simulate loading delay for smooth animation
    setTimeout(() => {
      setVisibleItems((prev) =>
        Math.min(prev + itemsPerLoad, publishedBlogs?.length || 0),
      );
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, publishedBlogs?.length, itemsPerLoad]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (viewMode !== "infinite" || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [viewMode, hasMore, isLoadingMore, loading, loadMore]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of cards section
    const cardsSection = document.getElementById("blogs-cards-section");
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  // Get current blogs based on view mode
  const getCurrentBlogs = () => {
    if (viewMode === "pagination") {
      return paginatedBlogs;
    } else {
      return infiniteBlogs;
    }
  };

  const currentBlogs = getCurrentBlogs();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with animation */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="h-16 md:h-20 text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Our Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the latest insights, stories, and updates from our team
          </p>
        </div>

        {/* Controls Section - Only show on desktop (pagination mode) */}
        {!loading &&
          publishedBlogs &&
          publishedBlogs.length > 0 &&
          // totalPages > 1 &&
          viewMode === "pagination" && (
            <div className="my-8 hidden md:block ">
              <div className=" rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={publishedBlogs.length}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  showItemsPerPage={true}
                  showTotalInfo={true}
                  itemsPerPageOptions={[10, 20, 30, 45, 60]}
                  variant="default"
                />
              </div>
            </div>
          )}

        {/* Blog Cards Section */}
        <div id="blogs-cards-section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Initial loading skeletons
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            ) : currentBlogs.length > 0 ? (
              // Actual blog cards
              currentBlogs.map((blog, index) => (
                <div
                  key={blog._id || blog.id}
                  className="group relative animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

                  {/* Card */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Blog Image with overlay */}
                    {(blog.thumbnail || blog.coverImage) && (
                      <div className="relative h-56 overflow-hidden">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="cursor-pointer block w-full h-full"
                        >
                          <Image
                            src={blog?.thumbnail || blog?.coverImage}
                            alt={blog?.title || "Blog thumbnail"}
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
                        </Link>
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
                                (blog.author?.firstName || "") +
                                  (blog.author?.lastName || "") || "A",
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
                            {formatDate(blog.createdAt) ||
                              formatDate(blog.publishedAt) ||
                              "21 May 2025"}
                          </span>
                        </div>
                      </div>

                      {/* Blog Title with hover effect */}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="hover:underline"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      {/* Subtitle/Excerpt */}
                      <p
                        className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            (blog.description || blog.content)?.substring(
                              0,
                              120,
                            ) + "...",
                        }}
                      />

                      {/* Read More Link with arrow animation */}
                      <Link
                        href={`/blog/${blog.slug}`}
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
              ))
            ) : (
              // Empty state
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

          {/* Infinite Scroll Loading Indicator - Mobile Only */}
          {viewMode === "infinite" && !loading && hasMore && (
            <div ref={loaderRef} className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
                {isLoadingMore ? (
                  <>
                    <ImSpinner2 className="animate-spin text-2xl" />
                    <span>Loading more blogs...</span>
                  </>
                ) : (
                  <div className="h-10" /> // Invisible spacer when not loading
                )}
              </div>
            </div>
          )}

          {/* End of content message for infinite scroll - Mobile Only */}
          {viewMode === "infinite" &&
            !loading &&
            !hasMore &&
            currentBlogs.length > 0 && (
              <div className="text-center mt-8 py-8">
                <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    You've reached the end! That's all {currentBlogs.length}{" "}
                    blogs.
                  </span>
                </div>
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
