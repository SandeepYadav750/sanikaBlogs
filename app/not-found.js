// app/not-found.js
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/dashboard/blogs">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blogs
          </Button>
        </Link>
      </div>
    </div>
  );
}