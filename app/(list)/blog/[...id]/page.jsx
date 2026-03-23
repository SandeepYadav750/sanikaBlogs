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
import {
  Search,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  ArrowLeft,
  Eye,
  ThumbsUp,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Clock,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { fetchAllBlogs } from "@/redux/blogSlice";

const SingleBlog = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params.id;

  const { blogs, loading } = useSelector((store) => store.blog);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Find blog
  useEffect(() => {
    if (blogs && blogs.length > 0) {
      const blog = blogs.find((b) => String(b._id) === String(id));
      setSelectedBlog(blog);
    } else {
      dispatch(fetchAllBlogs());
    }
  }, [blogs, id, dispatch]);

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return "8 min read";
    const wordsPerMinute = 200;
    const words = content.split(/\s/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "21 May 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get author initials
  const getInitials = (name) => {
    if (!name) return "Sy";
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

  // Handle comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        author: "Current User",
        date: new Date().toISOString(),
        likes: 0,
      };
      setComments([...comments, newComment]);
      setComment("");
      toast.success("Comment added successfully!");
    }
  };

  if (loading && !selectedBlog) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading blog post...
          </p>
        </div>
      </div>
    );
  }

  if (!selectedBlog) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
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
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen dark:bg-gray-900 pb-2">
      <div className="bg-white dark:bg-gray-900 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 rounded-lg">
        {/* Breadcrumb */}
        <div className=" pb-4 border-b border-gray-200">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/blogs">Blogs</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>{selectedBlog?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Main Content */}
        <div className="pt-4 ">
          {/* Blog Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {selectedBlog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedBlog.author?.photoURL} />
                  <AvatarFallback className="bg-linear-to-r from-indigo-500 to-purple-500 text-white">
                    {getInitials(
                      selectedBlog.author?.firstName +
                        selectedBlog.author?.lastName || "SY",
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedBlog.author?.firstName +
                      selectedBlog.author?.lastName || "Sandeep Yadav ji"}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Published on {formatDate(selectedBlog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getReadingTime(selectedBlog.description)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={`gap-2 ${liked ? "text-red-600" : ""}`}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaved(!saved)}
                  className={`gap-2 ${saved ? "text-yellow-600" : ""}`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
                  />
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
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
          </div>

          {/* Feature Image */}
          {selectedBlog.thumbnail ? (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={selectedBlog.thumbnail}
                alt={selectedBlog.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          ) : (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-linear-to-r from-indigo-500 to-purple-500 h-64 flex items-center justify-center">
              <p className="text-white text-lg">Featured Image</p>
            </div>
          )}

          {/* Blog Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            {/* Introduction/Description */}
            {/* {selectedBlog.content && (
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedBlog.content}
              </p>
            </div>
          )} */}

            {/* Main Content */}
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              {selectedBlog.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                />
              ) : (
                <>
                  <p>Content Coming Soon...</p>
                </>
              )}
            </div>

            {/* Tags Section */}
            {/* {selectedBlog.tags && selectedBlog.tags.length > 0 && ( */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {/* {selectedBlog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))} */}
                <Badge
                  key="0"
                  variant="secondary"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Nextjs
                </Badge>
                <Badge
                  key="1"
                  variant="secondary"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Reactjs
                </Badge>
              </div>
            </div>
            {/* )} */}
          </article>

          {/* Engagement Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLiked(!liked)}
                  className={`gap-2 ${liked ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : ""}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Like
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("comment-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {selectedBlog.views || 1245} views
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div
            id="comment-section"
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {comments.length} Comments
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="3"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" disabled={!comment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {comment.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/blogs")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Share this post:
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareBlog("twitter")}
                className="p-2"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareBlog("facebook")}
                className="p-2"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareBlog("linkedin")}
                className="p-2"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
