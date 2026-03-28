"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Tag,
  Clock,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  ArrowLeft,
  Eye,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { fetchAllBlogs } from "@/redux/blogSlice";

const SingleBlog = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params.id;

  const { blogs, loading } = useSelector((store) => store.blog);
  const [selectedBlog, setSelectedBlog] = useState(null);
  console.log("selectedBlog", selectedBlog);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // 🔥 FIND BLOG
  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const blog = blogs.find((b) => String(b._id) === String(id));
      setSelectedBlog(blog);
    } else {
      // If blogs not loaded, fetch them
      dispatch(fetchAllBlogs());
    }
  }, [blogs, id, dispatch]);

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const words = content.split(/\s/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", // optional
      hour12: true, // AM/PM format
    });
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

  // Share functionality
  const shareBlog = (platform) => {
    const url = window.location.href;
    const title = selectedBlog?.title || "Check out this blog";
    console.log("url $ title", title);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  if (loading && !selectedBlog) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="rounded-full h-16 w-16 border-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading blog post...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedBlog) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Blog Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push("/dashboard/blogs")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        {selectedBlog.thumbnail || selectedBlog.coverImage ? (
          <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full overflow-hidden">
            <Image
              src={selectedBlog.thumbnail || selectedBlog.coverImage}
              alt={selectedBlog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
          </div>
        ) : (
          <div className="h-[40vh] md:h-[50vh] lg:h-[60vh] w-full bg-linear-to-r from-indigo-900 to-purple-900"></div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="absolute top-4 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard/blogs"
                    className="hover:text-indigo-200 transition-colors"
                  >
                    Blogs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white/80">
                    {selectedBlog.title?.slice(0, 50)}...
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Blog Title and Meta */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <Badge className="mb-4 bg-indigo-600/80 backdrop-blur-sm hover:bg-indigo-600 text-white border-none">
              {selectedBlog.category || "Blog"}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {selectedBlog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedBlog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getReadingTime(selectedBlog.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{selectedBlog.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Section */}
        <Card className="mb-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-4 ring-indigo-100 dark:ring-indigo-900/50">
                <AvatarImage src={selectedBlog.author?.photoURL} />
                <AvatarFallback className="bg-linear-to-r from-indigo-500 to-purple-500 text-white text-lg">
                  {getInitials(
                    selectedBlog.author?.firstName +
                      selectedBlog.author?.lastName || "Author",
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {selectedBlog.author?.firstName +
                    selectedBlog.author?.lastName || "Anonymous Author"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBlog.author?.bio ||
                    "Passionate writer sharing knowledge and insights"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`gap-2 ${liked ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : ""}`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span>
                  {liked
                    ? selectedBlog.likes
                      ? selectedBlog.likes + 1
                      : 1
                    : selectedBlog.likes || 0}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSaved(!saved)}
                className={`gap-2 ${saved ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" : ""}`}
              >
                <Bookmark
                  className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
                />
                Save
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                    <button
                      onClick={() => shareBlog("facebook")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => shareBlog("twitter")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => shareBlog("linkedin")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </button>
                    <Separator className="my-1" />
                    <button
                      onClick={() => shareBlog("copy")}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-600" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Blog Body */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Introduction */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 leading-relaxed space-y-6">
              {selectedBlog.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              ) : (
                <p>No content available for this blog post.</p>
              )}
            </div>

            {/* Main Content */}

            {selectedBlog.description && (
              <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <p
                  className="text-xl text-gray-600 dark:text-gray-300 italic leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                ></p>
              </div>
            )}

            {/* Tags Section */}
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-400 mt-1" />
                  {selectedBlog.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Engagement Section */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-none">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Share your thoughts and help others discover this content
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp
                  className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  router.push(`/dashboard/blogs/${selectedBlog._id}/comments`)
                }
              >
                <MessageCircle className="w-4 h-4" />
                Write a Comment
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => shareBlog("copy")}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/blogs")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Eye className="inline w-4 h-4 mr-1" />
            {selectedBlog.views || 0} views
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
