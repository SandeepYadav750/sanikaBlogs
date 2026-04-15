"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getAllComment } from "@/redux/commentSlice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserLikedBlogs } from "@/redux/blogSlice";
import {
  Eye,
  FileText,
  MessageCircle,
  Heart,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  Minus,
} from "lucide-react";

const TotalProperty = () => {
  const dispatch = useDispatch();
  const { allComments } = useSelector((state) => state.comment);
  const { blogs } = useSelector((state) => state.blog);
  const [totalLikes, setTotalLikes] = useState(null);
  const [loading, setLoading] = useState({
    comments: false,
    likes: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  // State for storing historical data
  const [historicalData, setHistoricalData] = useState({
    views: { current: 24800, lastMonth: 22143 },
    blogs: { current: 0, lastMonth: 0 },
    comments: { current: 0, lastMonth: 0 },
    likes: { current: 0, lastMonth: 0 },
  });

  // Function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0)
      return { value: 100, trend: "up", display: "+100%" };
    const change = ((current - previous) / previous) * 100;
    const rounded = Math.abs(Math.round(change * 10) / 10);
    return {
      value: rounded,
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      display: `${change > 0 ? "+" : ""}${rounded}%`,
    };
  };

  // Fetch all comments - wrapped in useCallback
  const fetchAllComments = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, comments: true }));
      const result = await dispatch(getAllComment());

      setHistoricalData((prev) => ({
        ...prev,
        comments: {
          ...prev.comments,
          current: result.payload?.totalComments || 0,
        },
      }));
    } catch (error) {
      console.error("fetch comments error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch comments. Please try again.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  }, [dispatch]);

  // Fetch total liked blogs - wrapped in useCallback
  const fetchUsertotalLikedBlogs = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, likes: true }));
      const result = await dispatch(fetchUserLikedBlogs());
      const currentLikes = result.payload?.totalLikes || 0;
      setTotalLikes(currentLikes);

      setHistoricalData((prev) => ({
        ...prev,
        likes: {
          ...prev.likes,
          current: currentLikes,
        },
      }));
    } catch (error) {
      console.error("fetch All Liked blogs error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch liked blogs. Please try again.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, likes: false }));
    }
  }, [dispatch]);

  // Save current month's data for next month comparison - wrapped in useCallback
  const saveHistoricalData = useCallback(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const dataToSave = {
      month: currentMonth,
      data: {
        blogs: blogs?.length || 0,
        comments: allComments?.totalComments || 0,
        likes: totalLikes || 0,
        views: 24800,
      },
    };
    localStorage.setItem(
      "dashboard_historical_data",
      JSON.stringify(dataToSave),
    );
  }, [blogs?.length, allComments?.totalComments, totalLikes]);

  // Function to get last month's data from localStorage
  const loadHistoricalData = useCallback(() => {
    const storedData = localStorage.getItem("dashboard_historical_data");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

      if (parsed.month === currentMonth) {
        setHistoricalData((prev) => ({
          ...prev,
          blogs: { ...prev.blogs, lastMonth: parsed.data.blogs },
          comments: { ...prev.comments, lastMonth: parsed.data.comments },
          likes: { ...prev.likes, lastMonth: parsed.data.likes },
          views: { ...prev.views, lastMonth: parsed.data.views },
        }));
      }
    }
  }, []);

  // Function to get real change values
  const getRealChangeValue = useCallback(
    (type, currentValue) => {
      let lastMonthValue = 0;

      switch (type) {
        case "Total Views":
          lastMonthValue = historicalData.views.lastMonth;
          break;
        case "Total Blogs":
          lastMonthValue = historicalData.blogs.lastMonth;
          break;
        case "Comments":
          lastMonthValue = historicalData.comments.lastMonth;
          break;
        case "Likes":
          lastMonthValue = historicalData.likes.lastMonth;
          break;
        default:
          lastMonthValue = 0;
      }

      const change = calculatePercentageChange(currentValue, lastMonthValue);

      if (lastMonthValue === 0 && currentValue > 0) {
        return {
          ...change,
          display: "New this month",
          isNew: true,
        };
      }

      return change;
    },
    [historicalData],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAllComments(), fetchUsertotalLikedBlogs()]);

    setTimeout(() => {
      saveHistoricalData();
      toast.success("Statistics updated successfully!");
    }, 500);

    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchAllComments, fetchUsertotalLikedBlogs, saveHistoricalData]);

  // Main useEffect with all dependencies
  useEffect(() => {
    loadHistoricalData();
    fetchAllComments();
    fetchUsertotalLikedBlogs();

    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const timeUntilEndOfMonth = lastDayOfMonth - now;

    const timer = setTimeout(() => {
      saveHistoricalData();
    }, timeUntilEndOfMonth);

    return () => clearTimeout(timer);
  }, [
    loadHistoricalData,
    fetchAllComments,
    fetchUsertotalLikedBlogs,
    saveHistoricalData,
  ]);

  // Update historical data when blogs change
  useEffect(() => {
    if (blogs?.length) {
      setHistoricalData((prev) => ({
        ...prev,
        blogs: { ...prev.blogs, current: blogs.length },
      }));
    }
  }, [blogs]);

  const getIcon = (title) => {
    switch (title) {
      case "Total Views":
        return <Eye className="w-5 h-5" />;
      case "Total Blogs":
        return <FileText className="w-5 h-5" />;
      case "Comments":
        return <MessageCircle className="w-5 h-5" />;
      case "Likes":
        return <Heart className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  const getValue = (title) => {
    switch (title) {
      case "Total Views":
        return "24.8K";
      case "Total Blogs":
        return blogs?.length || 0;
      case "Comments":
        return allComments?.totalComments || 0;
      case "Likes":
        return totalLikes || 0;
      default:
        return 0;
    }
  };

  const isLoading = (title) => {
    if (title === "Comments") return loading.comments;
    if (title === "Likes") return loading.likes;
    return false;
  };

  const stats = [
    {
      title: "Total Views",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      borderColor: "hover:border-blue-200",
      getChange: () => getRealChangeValue("Total Views", 24800),
    },
    {
      title: "Total Blogs",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      borderColor: "hover:border-green-200",
      getChange: () => getRealChangeValue("Total Blogs", blogs?.length || 0),
    },
    {
      title: "Comments",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      borderColor: "hover:border-purple-200",
      getChange: () =>
        getRealChangeValue("Comments", allComments?.totalComments || 0),
    },
    {
      title: "Likes",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      borderColor: "hover:border-red-200",
      getChange: () => getRealChangeValue("Likes", totalLikes || 0),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time statistics and analytics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Updating..." : "Refresh Stats"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const title = stat.title;
          const value = getValue(title);
          const change = stat.getChange();
          const Icon = getIcon(title);
          const isLoadingStat = isLoading(title);

          return (
            <Card
              key={title}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${stat.borderColor} group`}
            >
              <CardContent className="p-6">
                {/* Decorative gradient background */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${stat.iconBg} rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-500`}
                />

                {/* Icon and Title Section */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconColor}`}
                  >
                    {Icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      change.trend === "up"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : change.trend === "down"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {change.trend === "up" && (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {change.trend === "down" && (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {change.trend === "neutral" && (
                      <Minus className="w-3 h-3" />
                    )}
                    {change.display}
                  </div>
                </div>

                {/* Value Section */}
                <div className="mt-4">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {title}
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    {isLoadingStat ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    ) : (
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {typeof value === "number"
                          ? value.toLocaleString()
                          : value}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <CardDescription className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {change.isNew ? (
                      <span className="text-blue-500">
                        📊 No previous data available
                      </span>
                    ) : (
                      <>
                        {change.trend === "up" && "↑"}
                        {change.trend === "down" && "↓"}
                        {change.trend === "neutral" && "•"}{" "}
                        {change.display === "0%"
                          ? "No change"
                          : `${change.display}`}{" "}
                        from last month
                        {change.trend === "up" && change.value > 50 && (
                          <span className="ml-1 text-green-500">
                            🚀 Excellent growth!
                          </span>
                        )}
                        {change.trend === "down" && change.value > 20 && (
                          <span className="ml-1 text-red-500">
                            ⚠️ Needs attention
                          </span>
                        )}
                      </>
                    )}
                  </CardDescription>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stat.iconColor.replace("text", "bg")} rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, Math.abs(change.value || 0))}%`,
                      backgroundColor:
                        stat.iconColor === "text-blue-500"
                          ? "#3B82F6"
                          : stat.iconColor === "text-green-500"
                            ? "#10B981"
                            : stat.iconColor === "text-purple-500"
                              ? "#8B5CF6"
                              : "#EF4444",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Insights Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Growth Analysis Card */}
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-none">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Growth Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const changes = {
                      comments: getRealChangeValue(
                        "Comments",
                        allComments?.totalComments || 0,
                      ),
                      likes: getRealChangeValue("Likes", totalLikes || 0),
                      blogs: getRealChangeValue(
                        "Total Blogs",
                        blogs?.length || 0,
                      ),
                    };

                    const bestPerformer = Object.entries(changes).reduce(
                      (best, [key, value]) => {
                        if (
                          value.trend === "up" &&
                          (!best || value.value > best.value)
                        ) {
                          return { key, value: value.value };
                        }
                        return best;
                      },
                      null,
                    );

                    return (
                      <>
                        <p className="text-gray-600 dark:text-gray-300">
                          📈 Best performing:{" "}
                          <span className="font-semibold text-green-600">
                            {bestPerformer
                              ? bestPerformer.key.charAt(0).toUpperCase() +
                                bestPerformer.key.slice(1)
                              : "No growth yet"}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">
                          Total engagement increased by{" "}
                          <span className="font-semibold text-blue-600">
                            {Math.round(
                              (changes.comments.value + changes.likes.value) /
                                2,
                            )}
                            %
                          </span>{" "}
                          compared to last month
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Comparison Card */}
        <Card className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-none">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Month-over-Month Comparison
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Comments</p>
                    <p className="font-semibold">
                      {historicalData.comments.lastMonth || 0} →{" "}
                      {allComments?.totalComments || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Likes</p>
                    <p className="font-semibold">
                      {historicalData.likes.lastMonth || 0} → {totalLikes || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated Timestamp */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TotalProperty;
