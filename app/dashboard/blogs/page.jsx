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
import { fetchAllBlogs, deleteBlog } from "@/redux/blogSlice";

const BlogList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blogs, loading, message, error } = useSelector((state) => state.blog);
  console.log("BlogList - Blog State:", {
    blogs,
    loading,
    message,
    error,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedBlogs =
    blogs?.length > 0
      ? [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];

  // Fetch blogs on component mount
  useEffect(() => {
    fetchAllBlogsData();
  }, []);

  const fetchAllBlogsData = async () => {
    try {
      await dispatch(fetchAllBlogs());
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to load blogs");
    }
  };

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
    console.log("blogId", blogId);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBlogId) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteBlog(selectedBlogId));
      console.log("selectedBlogId", selectedBlogId);

      console.log("result", result);
      toast.error(error);

      if (deleteBlog.fulfilled.match(result)) {
        toast.success(message);
        // Refresh the blog list
        await dispatch(fetchAllBlogs());
      } else {
        toast.error(error || "blog deleted");
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

  // Handle view blog
  const handleViewBlog = (blogId) => {
    router.push(`/blog/${blogId}`);
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
            onClick={fetchAllBlogsData}
            variant="outline"
            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 transition-all duration-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!sortedBlogs || sortedBlogs.length === 0) {
    return (
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No blogs yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create your first blog post and start sharing your thoughts with the
            world.
          </p>
          <Button
            onClick={() => router.push("/dashboard/write-blog")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Create Your First Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
                  Categories
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {
                    new Set(
                      sortedBlogs.map((blog) => blog?.category).filter(Boolean),
                    ).size
                  }
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
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
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Last Updated
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {sortedBlogs[0]?.createdAt
                    ? formatDate(sortedBlogs[0].createdAt)
                    : "N/A"}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Mobile View - Cards */}
          <div className="block lg:hidden">
            {sortedBlogs.filter(Boolean).map((blog, index) => (
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
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate"
                        onClick={() => handleViewBlog(blog?._id)}
                      >
                        {blog?.title || "Untitled"}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 p-1 h-auto"
                          onClick={() => handleViewBlog(blog?._id)}
                          title="Blog Detail"
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
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {blog?.content?.substring(0, 100) ||
                        "No description available"}
                      ...
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                  <TableHead className="w-32">Created Date</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedBlogs.filter(Boolean).map((blog, index) => (
                  <TableRow
                    key={blog?._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-center text-gray-600 dark:text-gray-300">
                      {index + 1}
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
                          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300"></div> */}
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
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors duration-200"
                        onClick={() => handleViewBlog(blog?._id)}
                      >
                        {blog?.title || "Untitled"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        {blog?.category || "Uncategorized"}
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
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 h-auto transition-all duration-200"
                          onClick={() => handleViewBlog(blog?._id)}
                          title="View Blog"
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Enhanced Delete Confirmation Dialog */}
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
