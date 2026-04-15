"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure you have this shadcn/ui component
import {
  ThumbsUp,
  Reply,
  Clock,
  Link2,
  MessageCircle,
  User,
  Calendar,
  Heart,
  MessageSquare,
  ExternalLink,
  Eye,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getAllComment } from "@/redux/commentSlice";

const Comments = () => {
  const dispatch = useDispatch();
  const [allComments, setAllComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, mostLiked, recent
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const result = await dispatch(getAllComment());
      // const res = await axios.get(
      //   `https://sanikablogsbackend-1.onrender.com/api/comment/my-blogs/comments`,
      //   {
      //     withCredentials: true,
      //   },
      // );
      console.log("fetch all comment response:", result.payload);
      if (getAllComment.fulfilled.match(result)) {
        setAllComments(result.payload);
      } else {
        toast.error(error || "comment fetch failed");
      }
    } catch (error) {
      console.error("fetch comments error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed fetch all comments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  // Helper function to get initials from name
  const getInitials = (firstName, lastName) => {
    if (!firstName) return "U";
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase();
  };

  // Format date nicely without external dependencies
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      if (diffInSeconds < 60) {
        return "just now";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
      } else if (diffInDays === 1) {
        return "yesterday";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
      } else if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
      } else {
        return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "recently";
    }
  };

  // Format full date for tooltip
  const getFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Check if comment is new (within last 7 days)
  const isNewComment = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  };

  // Search through comments by blog title or comment content
  const searchComments = (comments, query) => {
    if (!query.trim()) return comments;

    const lowerQuery = query.toLowerCase();
    return comments.filter((comment) => {
      const blogTitle = comment.postId?.title?.toLowerCase() || "";
      const commentContent = comment.content?.toLowerCase() || "";
      const authorName =
        `${comment.userId?.firstName || ""} ${comment.userId?.lastName || ""}`.toLowerCase();

      return (
        blogTitle.includes(lowerQuery) ||
        commentContent.includes(lowerQuery) ||
        authorName.includes(lowerQuery)
      );
    });
  };

  // Process comments data
  const getProcessedComments = () => {
    if (!allComments?.comments) return [];

    let comments = [...allComments.comments];

    // Apply search filter first
    comments = searchComments(comments, searchQuery);

    // Apply sort filters
    if (selectedFilter === "mostLiked") {
      comments.sort((a, b) => b.numberOfLikes - a.numberOfLikes);
    } else if (selectedFilter === "recent") {
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: show most recent first
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return comments;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const comments = getProcessedComments();
  const totalComments = allComments?.totalComments || 0;
  const totalLikes = comments.reduce(
    (sum, comment) => sum + (comment.numberOfLikes || 0),
    0,
  );
  const uniquePosts = new Set(comments.map((c) => c.postId?._id)).size;
  const searchActive = searchQuery.length > 0;

  // Highlight matching text in comment content
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const parts = text.split(
      new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
    );
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading your comments...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Comments Hub
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm ml-12">
                Manage and engage with all comments across your blog posts
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {totalComments}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Likes
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {totalLikes}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Posts
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {uniquePosts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by blog title, comment content, or author name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>

          {/* Search Results Info */}
          {searchActive && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2 text-sm">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Search className="h-4 w-4" />
                <span>
                  Found <strong>{comments.length}</strong> comment
                  {comments.length !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              >
                <X className="h-3 w-3 mr-1" />
                Clear search
              </Button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className="gap-2"
              >
                <MessageCircle className="h-3 w-3" />
                All Comments
              </Button>
              <Button
                variant={selectedFilter === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("recent")}
                className="gap-2"
              >
                <Clock className="h-3 w-3" />
                Most Recent
              </Button>
              <Button
                variant={selectedFilter === "mostLiked" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("mostLiked")}
                className="gap-2"
              >
                <ThumbsUp className="h-3 w-3" />
                Most Liked
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAllComments}
              className="text-gray-600 dark:text-gray-400"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
          </div>
        </div>

        {/* Comments Grid View */}
        {comments.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            {searchActive ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No matching comments
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No comments found matching &quot;{searchQuery}&quot;
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No comments yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  When readers comment on your blogs, they&apos;ll appear here
                </p>
              </>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <Card
                key={comment._id}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  {/* Header: Blog Title & Badges */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`/blog/${comment.postId?._id}`}
                          className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 transition-colors"
                        >
                          {searchActive && searchQuery
                            ? highlightText(
                                comment.postId?.title || "Untitled Blog",
                                searchQuery,
                              )
                            : comment.postId?.title || "Untitled Blog"}
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                        {isNewComment(comment.createdAt) && (
                          <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 border-0">
                            <span className="mr-1">✨</span>
                            New
                          </Badge>
                        )}
                        {comment.editedAt &&
                          new Date(comment.editedAt) >
                            new Date(comment.createdAt) && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-100 dark:bg-gray-700"
                            >
                              Edited
                            </Badge>
                          )}
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                      title={getFullDate(comment.createdAt)}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="mb-4 pl-0 md:pl-2">
                    <div className="relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors">
                        {searchActive && searchQuery
                          ? highlightText(comment.content, searchQuery)
                          : `"${comment.content}"`}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Author & Engagement */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 transition-all">
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                          {getInitials(
                            comment.userId?.firstName,
                            comment.userId?.lastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {searchActive && searchQuery
                            ? highlightText(
                                `${comment.userId?.firstName || ""} ${comment.userId?.lastName || ""}`,
                                searchQuery,
                              )
                            : `${comment.userId?.firstName || ""} ${comment.userId?.lastName || ""}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.userId?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Likes */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <ThumbsUp
                          className={`h-4 w-4 ${comment.numberOfLikes > 0 ? "text-red-500 fill-red-500" : "text-gray-500 dark:text-gray-400"}`}
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {comment.numberOfLikes || 0}
                        </span>
                        {comment.numberOfLikes > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            like{comment.numberOfLikes !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Reply indicator */}
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Reply className="h-4 w-4" />
                        <span className="text-sm">Reply</span>
                      </div>

                      {/* View Post Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() =>
                          window.open(`/blog/${comment.postId?._id}`, "_blank")
                        }
                      >
                        <Link2 className="h-3 w-3" />
                        View Post
                      </Button>
                    </div>
                  </div>

                  {/* Additional metadata for edited timestamp */}
                  {comment.editedAt &&
                    comment.editedAt !== comment.createdAt && (
                      <div className="mt-2 text-right">
                        <span
                          className="text-xs text-gray-400 dark:text-gray-500 italic"
                          title={getFullDate(comment.editedAt)}
                        >
                          edited {formatDate(comment.editedAt)}
                        </span>
                      </div>
                    )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Stats Bar */}
        {comments.length > 0 && (
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comments.length}
                    </span>{" "}
                    {searchActive ? "matching comments" : "total comments"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalLikes}
                    </span>{" "}
                    total likes
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4 text-purple-500" />
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comments.length}
                    </span>{" "}
                    commenters
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
