"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { TbEye } from "react-icons/tb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  fetchAllBlogs,
  deleteBlog,
  fetchPublishedBlogs,
} from "@/redux/blogSlice";
import Pagination from "@/components/Pagination"; // Import the pagination component

const BlogList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blogs, publishedBlogs, loading, error } = useSelector(
    (state) => state.blog,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter blogs based on search - WITH NULL CHECK
  const filteredBlogs = blogs.filter((blog) => {
    // Skip if blog is null or undefined
    if (!blog || !blog.title) return false;
    return blog.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort blogs (all blogs from fetchAllBlogs)
  const sortedBlogs =
    filteredBlogs?.length > 0
      ? [...filteredBlogs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
      : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Create a Set of published blog slugs
  const publishedBlogSlugs = new Set(
    publishedBlogs?.map((blog) => blog.slug) || [],
  );

  // Check if a blog is published (by slug)
  const isBlogPublished = (blogSlug) => {
    return publishedBlogSlugs.has(blogSlug);
  };

  // Fetch blogs when component mounts
  useEffect(() => {
    dispatch(fetchPublishedBlogs());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle delete click
  const handleDeleteClick = (blogId) => {
    setSelectedBlogId(blogId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBlogId) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteBlog(selectedBlogId));

      if (deleteBlog.fulfilled.match(result)) {
        // Refresh both blog lists
        await dispatch(fetchAllBlogs());
        await dispatch(fetchPublishedBlogs());
        toast.success(result.payload.message || "Blog deleted successfully");
        // Reset to first page if current page becomes empty
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(result.payload.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle edit navigation
  const handleEdit = (blogId) => {
    router.push(`/dashboard/write-blog/${blogId}`);
  };

  // Handle view blog - only for published blogs
  const handleViewBlog = (blogSlug) => {
    console.log("Attempting to view blog at URL:", blogSlug);
    if (isBlogPublished(blogSlug)) {
      router.push(`/blog/${blogSlug}`);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Loading state
  if (loading && (!sortedBlogs || sortedBlogs.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center transform transition-all duration-500">
          <div className="relative">
            <ImSpinner2 className="animate-spin text-5xl mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />
            <div className="absolute inset-0 animate-ping opacity-20">
              <ImSpinner2 className="text-5xl mx-auto text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium animate-pulse">
            Loading your blogs...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-6 text-lg font-medium">
            {error}
          </p>
          <Button
            onClick={() => {
              dispatch(fetchAllBlogs());
              dispatch(fetchPublishedBlogs());
            }}
            variant="outline"
            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 transition-all duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Manage and organize your blog posts
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/write-blog")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Blog
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Total Blogs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sortedBlogs.length}
                </p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Published Blogs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sortedBlogs?.filter((blog) => blog.isPublished === true)
                    .length || 0}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Draft Blogs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sortedBlogs?.filter((blog) => blog.isPublished === false)
                    .length || 0}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent dark:focus-within:ring-blue-400">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
          <input
            type="text"
            placeholder="Search Blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {!sortedBlogs || sortedBlogs.length === 0 ? (
          <div className="flex justify-center items-center min-h-[60vh] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full p-6 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No matching blogs found" : "No blogs yet"}
              </p>
              {!searchTerm && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No blogs yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Create your first blog post and start sharing your thoughts
                    with the world.
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/write-blog")}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Create Your First Blog
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="block lg:hidden">
                {currentItems.filter(Boolean).map((blog) => {
                  const isPublished = isBlogPublished(blog?.slug);

                  return (
                    <div
                      key={blog?._id}
                      className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="shrink-0">
                          {blog?.thumbnail || blog?.coverImage ? (
                            <Image
                              src={blog?.thumbnail || blog?.coverImage}
                              alt={blog?.title || "Blog thumbnail"}
                              className="h-16 w-16 rounded-lg object-cover"
                              width={64}
                              height={64}
                              unoptimized={true}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`text-lg font-semibold cursor-pointer truncate ${
                                isPublished
                                  ? "text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                              onClick={() =>
                                isPublished && handleViewBlog(blog?.slug)
                              }
                            >
                              {blog?.title || "Untitled"}
                              {!isPublished && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300">
                                  Draft
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`p-1 h-auto ${
                                  isPublished
                                    ? "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                    : "text-gray-400 cursor-not-allowed opacity-50"
                                }`}
                                onClick={() =>
                                  isPublished && handleViewBlog(blog?.slug)
                                }
                                disabled={!isPublished}
                                title={
                                  isPublished
                                    ? "View Blog"
                                    : "Publish blog to view"
                                }
                              >
                                <TbEye size={18} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 p-1 h-auto"
                                onClick={() => handleEdit(blog?._id)}
                                title="Edit blog"
                              >
                                <FiEdit2 size={18} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700 p-1 h-auto"
                                onClick={() => handleDeleteClick(blog?._id)}
                                title="Delete blog"
                              >
                                <FiTrash2 size={18} />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                              {blog?.category || "Uncategorized"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(blog?.createdAt || blog?.date)}
                            </span>
                            {!isPublished && (
                              <span className="text-xs text-orange-500 dark:text-orange-400">
                                Not Published
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {blog?.content?.substring(0, 100) ||
                              "No description available"}
                            ...
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="w-16 text-center">#</TableHead>
                      <TableHead className="w-24">Thumbnail</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-32">Category</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-32">Created Date</TableHead>
                      <TableHead className="w-32 text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentItems.filter(Boolean).map((blog, index) => {
                      const isPublished = isBlogPublished(blog?.slug);

                      return (
                        <TableRow
                          key={blog?._id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-center text-gray-600 dark:text-gray-300">
                            {indexOfFirstItem + index + 1}
                          </TableCell>

                          <TableCell>
                            {blog?.thumbnail || blog?.coverImage ? (
                              <div className="relative group">
                                <Image
                                  src={blog?.thumbnail || blog?.coverImage}
                                  alt={blog?.title || "Blog thumbnail"}
                                  className="h-12 w-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                  width={80}
                                  height={48}
                                  unoptimized={true}
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-20 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="font-medium">
                            <div
                              className={`cursor-pointer line-clamp-2 transition-colors duration-200 ${
                                isPublished
                                  ? "hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                              onClick={() =>
                                isPublished && handleViewBlog(blog?.slug)
                              }
                            >
                              {blog?.title || "Untitled"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                              {blog?.category || "Uncategorized"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                isPublished
                                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                                  : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                              }`}
                            >
                              {isPublished ? "Published" : "Draft"}
                            </span>
                          </TableCell>

                          <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(blog?.createdAt || blog?.date)}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`p-2 h-auto transition-all duration-200 ${
                                  isPublished
                                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    : "text-gray-400 cursor-not-allowed opacity-50"
                                }`}
                                onClick={() =>
                                  isPublished && handleViewBlog(blog?.slug)
                                }
                                disabled={!isPublished}
                                title={
                                  isPublished
                                    ? "View Blog"
                                    : "Publish blog to view"
                                }
                              >
                                <TbEye size={18} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-2 h-auto transition-all duration-200"
                                onClick={() => handleEdit(blog?._id)}
                                title="Edit Blog"
                              >
                                <FiEdit2 size={18} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-auto transition-all duration-200"
                                onClick={() => handleDeleteClick(blog?._id)}
                                title="Delete Blog"
                              >
                                <FiTrash2 size={18} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={sortedBlogs.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showItemsPerPage={true}
                itemsPerPageOptions={[5, 10, 25, 50]}
                showTotalInfo={true}
                variant="default"
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <FiTrash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="w-full text-center text-xl font-bold text-gray-900 dark:text-white">
              Delete Blog Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this blog post? This action cannot
              be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isDeleting ? (
                <>
                  <ImSpinner2 className="animate-spin mr-2" /> Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogList;
