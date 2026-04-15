"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/authSlice";
import Image from "next/image";
import { fetchPublishedBlogs } from "../redux/blogSlice";

const PopularAuthors = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, error } = useSelector((state) => state.auth);
  const { publishedBlogs } = useSelector((state) => state.blog);

  console.log("All users from Redux:", allUsers);
  console.log("Published blogs from Redux:", publishedBlogs);

  // Fetch blogs and users when component mounts
  useEffect(() => {
    if (!publishedBlogs) {
      dispatch(fetchPublishedBlogs());
    }
    if (!allUsers) {
      dispatch(getAllUsers());
    }
  }, [dispatch, publishedBlogs, allUsers]);

  // Calculate popular authors using useMemo (no setState needed)
  const popularAuthors = useMemo(() => {
    // Get users array safely
    const usersArray = allUsers?.users || allUsers || [];

    if (!usersArray.length || !publishedBlogs?.length) {
      return [];
    }

    // Calculate post count for each author
    const authorsWithPostCount = usersArray.map((user) => {
      // Count publishedBlogs by this author
      const postCount = publishedBlogs.filter((blog) => {
        const authorId = blog.author?._id || blog.author;
        return authorId === user._id;
      }).length;

      return { ...user, postCount };
    });

    // Sort by post count (descending) and get top 4
    const sortedAuthors = authorsWithPostCount
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 4);

    return sortedAuthors;
  }, [publishedBlogs, allUsers]);

  // Loading state
  if (loading && !allUsers) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Loading authors...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <p className="text-red-500">Failed to load authors: {error}</p>
        <button
          onClick={() => dispatch(getAllUsers())}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
          Popular Authors
        </h1>
        <hr className="w-24 border-2 border-blue-500 rounded-full" />
        <p className="text-gray-500 mt-3 text-center">
          Meet our talented community of writers
        </p>
      </div>

      {popularAuthors.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {!publishedBlogs || publishedBlogs.length === 0
            ? "No posts yet."
            : "No authors found yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularAuthors.map((author, index) => (
            <div
              key={author._id || index}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative w-28 h-28 mb-4">
                {author?.photoURL ? (
                  <Image
                    src={author.photoURL}
                    alt={`${author.firstName} ${author.lastName}`}
                    loading="eager"
                    fill
                    className="rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-300 transition-all"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-300 transition-all">
                    {author.firstName?.[0]}
                    {author.lastName?.[0]}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                {author.firstName} {author.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                {author.email}
              </p>
              {author.bio && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2 line-clamp-2">
                  {author.bio}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  {author.postCount} {author.postCount === 1 ? "post" : "posts"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularAuthors;
