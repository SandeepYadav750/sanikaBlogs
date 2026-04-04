import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Send,
  User,
  MoreVertical,
  ThumbsUp,
  Reply,
  Share2,
  Flag,
  Smile,
  Image,
  AtSign,
  Gift,
} from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
// Import your Redux actions (adjust path as needed)
import {
  createComment,
  deleteComment,
  editComment,
  fetchComments,
  likedComment,
} from "@/redux/commentSlice";
import { ImSpinner2 } from "react-icons/im";

const CommentBox = ({ blogId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.user) || {};
  const { comments, loading } = useSelector((state) => state.comment);

  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState("");
  const [editContent, setEditContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // Fetch comments when component mounts or blogId changes
  useEffect(() => {
    if (blogId) {
      dispatch(fetchComments(blogId));
    }
  }, [blogId, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "21 May 2025";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "SY";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-green-500",
    ];
    const index = name?.length ? name.length % colors.length : 0;
    return colors[index];
  };

  const handleLike = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    toast.success(!likedComments[commentId] ? "Liked!" : "Unliked!");
  };

  const handleReply = (commentId, userName) => {
    setReplyTo(replyTo === commentId ? null : commentId);
    setReplyText(`@${userName} `);
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (!replyText.trim()) return;
    if (!user) {
      toast.error("Please login to reply");
      return;
    }

    toast.success("Reply posted successfully!");
    setReplyTo(null);
    setReplyText("");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      const result = await dispatch(
        createComment({
          blogId,
          content: comment,
        }),
      ).unwrap();
      console.log("result", result);

      if (result.success) {
        setComment("");
        toast.success(result.message || "Comment added successfully!");
        dispatch(fetchComments(blogId));
      } else {
        toast.error(
          result.message || "Comment Submit Failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(
          error.message || "Failed to submit comment. Please try again.",
        );
      }
    }
  };

  const HandleDeleteSubmit = async (id) => {
    try {
      const result = await dispatch(deleteComment(id)).unwrap(); // Just pass the id

      console.log("result", result);

      if (result.success) {
        toast.success(result.message || "Comment deleted successfully!");
        // Remove from local state
        const updatedComments = comments.filter(
          (item) => (item._id || item.id) !== id,
        );
        // If you have access to setComments or need to refetch:
        dispatch(fetchComments(blogId));
      } else {
        toast.error(result.message || "Error while deleting comment");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error?.message || "Failed to delete comment. Please try again.",
      );
    }
  };

  // const HandleEditSubmit = async (id) => {
  //   try {
  //     const res = await axios.put(
  //       `http://localhost:8000/api/comment/${id}/edit`,
  //       { content: editContent },
  //       {
  //         withCredentials: true,
  //       },
  //     );
  //     if (res.data.success) {
  //       // const updatedCommentsData = comments.map((item) =>
  //       //   item._id === id ? { ...item, content: editContent } : item,
  //       // );
  //       toast.success(res.data.message);
  //       setEditCommentId(null);
  //       setEditContent("");
  //       dispatch(fetchComments(blogId));
  //     }
  //   } catch (error) {
  //     console.error("Edit error:", error);
  //     toast.error(
  //       error?.message || "Failed to Edit comment. Please try again.",
  //     );
  //   }
  // };

  const HandleEditSubmit = async (id) => {
    try {
      const result = await dispatch(
        editComment({
          commentId: id, // ✅ You need to pass the commentId
          content: editContent,
        }),
      ).unwrap();
      console.log("result", result);

      if (result.success) {
        setEditCommentId(null);
        setEditContent("");
        toast.success(result.message || "Comment Edit successfully!");
        dispatch(fetchComments(blogId));
      } else {
        toast.error(result.message || "Comment Edit Failed. Please try again.");
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error(
        error?.message || "Failed to Edit comment. Please try again.",
      );
    }
  };

  const HandleLikeSubmit = async (id) => {
    setLoadingId(id);
    try {
      const result = await dispatch(likedComment(id)).unwrap();
      console.log("result", result);

      if (result.success) {
        toast.success(result.message);
        dispatch(fetchComments(blogId));
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error(
        error?.message || "Failed to Like comment. Please try again.",
      );
    }
  };

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl -z-10"></div>

      <div className="relative z-10 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-4 md:mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-4">
            <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Community Discussion
            </span>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Join the Conversation
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your thoughts, ask questions, and connect with others in the
            community
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{comments?.length || 0} Comments</span>
            </div>
          </div>
        </div>

        {/* Comment Form - Glassmorphism Design */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border transition-all duration-300 ${
              isFocused
                ? "border-indigo-300 dark:border-indigo-500 shadow-2xl scale-[1.02]"
                : "border-gray-200 dark:border-gray-700 hover:shadow-lg"
            }`}
          >
            <div className="p-3 md:p-6">
              <div className="flex gap-4">
                <div className="relative">
                  <Avatar className="h-7 md:h-14 w-7 md:w-14 ring-4 ring-indigo-100 dark:ring-indigo-900/50 shadow-lg">
                    <AvatarFallback
                      className={`bg-linear-to-br ${getRandomColor(user?.firstName)} text-white text-base font-semibold`}
                    >
                      {user
                        ? getInitials(
                            (user.firstName || "") + (user.lastName || ""),
                          )
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={
                        user
                          ? "What are your thoughts?..."
                          : "Please login to join the discussion"
                      }
                      className="w-full p-2 md:px-5 md:py-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-0 transition-all"
                      rows="3"
                      disabled={loading || !user}
                    />

                    {/* Toolbar */}
                    {user && (
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                          <Image className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                          <AtSign className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                          <Gift className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <span>{comment.length} characters</span>
                      {comment.length > 0 && comment.length < 10 && (
                        <span className="text-yellow-500">
                          ✍️ Keep writing...
                        </span>
                      )}
                    </div>
                    <Button
                      type="submit"
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim() || !user || loading}
                      className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-2 md:px-6 md:py-2.5 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </div>
                      ) : (
                        <div className="text-[10px] md:text-base flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          <span>Post Comment</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List - Modern Card Design */}
        <div className="max-w-4xl mx-auto space-y-6">
          {loading && comments?.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Loading amazing comments...
              </p>
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="inline-flex p-4 bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-4">
                <MessageCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No comments yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments?.map((comment, index) => (
              <div
                key={comment._id || comment.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-2 md:p-6 ">
                    <div className="flex gap-4">
                      {/* Avatar with linear */}
                      <div className="relative">
                        <Avatar className="h-6 md:h-12 w-6 md:w-12 ring-3 ring-indigo-100 dark:ring-indigo-900/30">
                          <AvatarFallback
                            className={`bg-linear-to-br ${getRandomColor(comment.userId?.firstName)} text-white text-xs md:text-sm font-semibold`}
                          >
                            {comment.userId?.firstName?.charAt(0)}
                            {comment.userId?.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                      </div>

                      <div className="flex-1">
                        {/* Comment Header */}
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                              {comment.userId?.firstName}{" "}
                              {comment.userId?.lastName}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer">
                              {formatDate(comment.createdAt || comment.date)}
                            </span>
                            {index === 0 && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="hidden md:block text-xs bg-linear-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                                  Top Comment
                                </span>
                              </>
                            )}
                          </div>

                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVertical className="cursor-pointer" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuGroup>
                                  {comment?.userId?._id === user?._id ? (
                                    <>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-blue-600 focus:text-blue-600"
                                        onClick={() => {
                                          setEditCommentId(comment._id);
                                          setEditContent(comment.content);
                                        }}
                                      >
                                        <FaEdit className="w-4 h-4 mr-2 text-blue-600" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() =>
                                          HandleDeleteSubmit(comment._id)
                                        }
                                      >
                                        <FiTrash2 className="w-4 h-4 mr-2 text-red-600" />
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  ) : null}
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Flag className="w-4 h-4 mr-2" />
                                    Report
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Comment Content */}
                        {editCommentId === comment._id ? (
                          <>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              className="w-full p-2 md:px-5 md:py-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-0 transition-all"
                              rows="3"
                              disabled={loading || !user}
                            />
                            <div className="flex py-2 gap-2">
                              <Button
                                onClick={() => {
                                  HandleEditSubmit(comment._id);
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditCommentId(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {comment.content || comment.text}
                          </p>
                        )}

                        {/* Comment Actions */}
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => HandleLikeSubmit(comment._id)}
                            disabled={loading}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 group"
                          >
                            <div
                              className={`p-1 rounded-full transition-all ${
                                comment.likes.includes(user._id)
                                  ? "bg-red-50 dark:bg-red-900/20"
                                  : "group-hover:bg-red-50 dark:group-hover:bg-red-900/20"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 transition-all ${
                                  comment.likes.includes(user._id)
                                    ? "fill-red-500 text-red-500 scale-110"
                                    : "group-hover:scale-110"
                                }`}
                              />
                            </div>
                            <span
                              className={`flex gap-2 justify-center items-center ${
                                // comment.likes.length !== 0
                                comment.likes.includes(user._id)
                                  ? "text-red-500 font-medium"
                                  : ""
                              }`}
                            >
                              {loading && comment._id === loadingId ? (
                                <>
                                  <ImSpinner2 className="animate-spin" />
                                </>
                              ) : (
                                comment.numberOfLikes || 0
                              )}{" "}
                              likes
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              handleReply(
                                comment._id || comment.id,
                                `${comment.userId?.firstName} ${comment.userId?.lastName}`,
                              )
                            }
                            disabled={loading}
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 group"
                          >
                            <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                              <Reply className="w-4 h-4" />
                            </div>
                            <span>Reply</span>
                          </button>
                        </div>

                        {/* Reply Form with Animation */}
                        {replyTo === (comment._id || comment.id) && (
                          <div className="mt-6 pl-4 md:pl-12 border-l-2 border-indigo-200 dark:border-indigo-800 animate-slide-down">
                            <div className="bg-linear-to-r from-indigo-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-xl p-4">
                              <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback
                                    className={`bg-linear-to-br ${getRandomColor(user?.firstName)} text-white text-xs`}
                                  >
                                    {user
                                      ? getInitials(
                                          (user.firstName || "") +
                                            (user.lastName || ""),
                                        )
                                      : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                    placeholder={`Replying to @${comment.userId?.firstName} ${comment.userId?.lastName}...`}
                                    className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none border-0 shadow-sm"
                                    rows="2"
                                    disabled={loading}
                                    autoFocus
                                  />
                                  <div className="mt-3 flex gap-2 justify-end">
                                    <Button
                                      onClick={() => setReplyTo(null)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      disabled={loading}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleReplySubmit(
                                          comment._id || comment.id,
                                        )
                                      }
                                      size="sm"
                                      className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                                      disabled={loading || !replyText.trim()}
                                    >
                                      Post Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decorative bottom linear */}
                  <div className="h-0.5 bg-linear-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CommentBox;
