"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishedBlogs } from "@/redux/blogSlice";
import { fetchAllBlogs } from "@/redux/blogSlice";
import Link from "next/link";

const RecentBlogs = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Get state from Redux
  const { publishedBlogs } = useSelector((state) => state.blog);

  // Fetch blogs when component mounts
  useEffect(() => {
    dispatch(fetchPublishedBlogs());
  }, [dispatch]);

  // const publishedBlogs = useSelector((state) => state.blog.publishedBlogs);

  // useEffect(() => {
  //   setMounted(true);
  //   fetchAllBlogsData();
  // }, []);

  // const fetchAllBlogsData = async () => {
  //   try {
  //     await dispatch(fetchAllBlogs());
  //   } catch (err) {
  //     console.error("Failed to fetch blogs:", err);
  //     toast.error("Failed to load blogs");
  //   }
  // };

  // Sort blogs by creation date (most recent first)
  const sortedBlogs =
    publishedBlogs?.length > 0
      ? [...publishedBlogs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
      : [];
  console.log("publishedBlogs", publishedBlogs);
  console.log("sortedBlogs", sortedBlogs);

  const defaultBlogs = [
    {
      id: 1,
      title: "What is Email Marketing and How to Do It Right",
      subtitle:
        "Learn the fundamentals of email marketing and best practices for high conversions.",
      category: "Marketing",
      readTime: "8 min read",
      date: "Mar 25, 2026",
      thumbnail: "/api/placeholder/400/300",
    },
    {
      id: 2,
      title: "What Is The Future Of Blockchain Developer",
      subtitle:
        "Exploring emerging trends, opportunities, and the evolving role of blockchain engineers.",
      category: "Technology",
      readTime: "12 min read",
      date: "Mar 22, 2026",
      thumbnail: "/api/placeholder/400/300",
    },
  ];

  const suggestedBlogs = [
    {
      id: 1,
      title: "10 tips to Master React",
      readTime: "6 min read",
      reads: "2.3k reads",
    },
    {
      id: 2,
      title: "Understanding Tailwind CSS",
      readTime: "5 min read",
      reads: "1.8k reads",
    },
    {
      id: 3,
      title: "Improve SEO in 2024",
      readTime: "7 min read",
      reads: "3.1k reads",
    },
  ];

  const categories = [
    { name: "Web Application", count: 24, icon: "💻" }, // Globe/World Wide Web
    { name: "Web Design", count: 42, icon: "🎨" }, // Art/Palette for design
    { name: "SEO", count: 18, icon: "📈" }, // Growth chart for SEO
    { name: "Digital Application", count: 12, icon: "📱" }, // Mobile/Digital device
    { name: "Mobile Application", count: 15, icon: "📲" }, // Mobile phone with arrow
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setNewsletterStatus("Thanks for subscribing! 🎉");
      setEmail("");
      setTimeout(() => setNewsletterStatus(""), 3000);
    } else {
      setNewsletterStatus("Please enter a valid email address.");
      setTimeout(() => setNewsletterStatus(""), 3000);
    }
  };

  const displayBlogs = sortedBlogs.length > 0 ? sortedBlogs : defaultBlogs;
  console.log("displayBlogs", displayBlogs);
  console.log("sortedBlogs", sortedBlogs);

  // if (!mounted) return null;

  return (
    <div className="border-t border-white bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section with Animation */}
        <header className="text-center mb-12 lg:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Latest Updates
          </div>
          <h1 className="h-16 md:h-20 text-5xl sm:text-6xl lg:text-7xl font-black bg-linear-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent ">
            Recent Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and stories from our creative team
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Blog Posts - Modern Card Design */}
            <div className="space-y-6">
              {displayBlogs.slice(0, 3).map((blog, index) => (
                <article
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* linear overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image Section */}
                    <div className="md:w-1/3 relative overflow-hidden rounded-xl">
                      <div className="relative h-48 md:h-full w-full overflow-hidden rounded-xl">
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {/* Category Badge on Image */}
                      <span className="absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm">
                        {blog.category || "XYZ"}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-2/3 flex flex-col">
                      {/* Meta Info Row */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
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
                          {blog.date ||
                            new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {blog.readTime ||
                            `${Math.ceil((blog.content?.length || 0) / 1000) || 5} min read`}
                        </span>
                        <span className="flex items-center gap-1">
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
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {blog.likes?.length || 0} likes
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Subtitle/Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                        {blog.subtitle ||
                          blog.description ||
                          blog.content?.substring(0, 120) + "..."}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {blog.author?.firstName?.[0] || "A"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {blog.author?.firstName}{" "}
                              {blog.author?.lastName || "XYZ"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {blog.author?.occupation || "Content Writer"}
                            </p>
                          </div>
                        </div>

                        <button
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all duration-300 group/btn"
                          onClick={() => {
                            router.push(`/blog/${blog._id}`);
                          }}
                        >
                          Read More
                          <svg
                            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {displayBlogs.length > 3 && (
                <div className="text-center mt-8">
                  <Link
                    href="/blogs"
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    View All Blogs →
                  </Link>
                </div>
              )}
            </div>

            {/* Suggested Blogs Section - Modern Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-3xl">✨</span> Suggested for You
                </h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View all →
                </button>
              </div>

              <div className="grid gap-4">
                {suggestedBlogs.map((blog, index) => (
                  <div
                    key={blog.id}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                      📚
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {blog.readTime}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          •
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {blog.reads}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Search Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Popular Categories Widget - Modern Design */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
                Popular Categories
              </h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    onClick={() =>
                      router.push(`/searchList?q=${category.name}`)
                    }
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Widget - Enhanced */}
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Newsletter</h3>
                <p className="text-blue-100 text-sm mb-5">
                  Get the latest posts delivered to your inbox
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  Subscribe <span className="ml-2">→</span>
                </button>
                {newsletterStatus && (
                  <p
                    className={`text-sm text-center mt-2 ${
                      newsletterStatus.includes("Thanks")
                        ? "text-green-200"
                        : "text-yellow-200"
                    }`}
                  >
                    {newsletterStatus}
                  </p>
                )}
              </form>
            </div>

            {/* Stats Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {displayBlogs.length}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Articles
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    2.5k+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Active Readers
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2026 BlogSphere — Fresh perspectives on tech, creativity, and
            growth.
          </p>
        </footer>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RecentBlogs;
