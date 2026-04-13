"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/authSlice";
import Image from "next/image";

const PopularAuthors = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blog);
  const { allUsers, loading, error } = useSelector((state) => state.auth);
  const [popularUser, setPopularUser] = useState([]);

  // Create a map of authorId -> blog count
  const blogCountByAuthor = useMemo(() => {
    const countMap = new Map();
    if (blogs && Array.isArray(blogs)) {
      blogs.forEach((blog) => {
        const authorId = blog.author?._id || blog.author;
        if (authorId) {
          countMap.set(authorId, (countMap.get(authorId) || 0) + 1);
        }
      });
    }
    return countMap;
  }, [blogs]);
  console.log("Blog count by author:", blogs);

  // Fetch all users when component mounts
  useEffect(() => {
    if (!allUsers) {
      dispatch(getAllUsers());
    }
  }, [dispatch, allUsers]);

  // Update local state when allUsers changes and sort by post count
  useEffect(() => {
    if (allUsers) {
      // Handle different possible response structures
      const usersArray = allUsers.users || allUsers || [];

      // Sort users by post count in descending order (highest first)
      const sortedUsers = [...usersArray].sort((a, b) => {
        const postCountA = blogCountByAuthor.get(a._id) || 0;
        const postCountB = blogCountByAuthor.get(b._id) || 0;
        return postCountB - postCountA;
      });

      setPopularUser(sortedUsers);
    }
  }, [allUsers, blogCountByAuthor]);
  console.log("Popular Authors:", popularUser);
  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Loading authors...</p>
      </div>
    );
  }

  // Show error state
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

      {popularUser.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No authors found yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularUser.slice(0, 4).map((user, index) => {
            const postCount = blogCountByAuthor.get(user._id) || 0;
            return (
              <div
                key={user._id || index}
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-28 h-28 mb-4">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-300 transition-all"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-300 transition-all">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                  {user.email}
                </p>
                {user.bio && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                    {postCount} {postCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {popularUser.length > 4 && (
        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/authors")}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            View All Authors →
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularAuthors;
