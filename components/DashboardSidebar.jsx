"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { ImBlogger2 } from "react-icons/im";
import { FaComments } from "react-icons/fa6";

const DashboardSidebar = () => {
  const pathname = usePathname();

  const linkClass = (href) => {
    const base = "flex items-center gap-2 px-3 py-2 rounded-md";
    let active = false;
    if (href === "/dashboard") {
      active = pathname === href;
    } else {
      active = pathname === href || pathname.startsWith(href + "/");
    }
    const extra = active
      ? "bg-gray-200 dark:bg-gray-700"
      : "hover:bg-gray-200 dark:hover:bg-gray-700";
    return `${base} ${extra}`;
  };

  return (
    <aside className="min-h-screen w-60 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm sticky top-4 bottom-0">
      <nav className="flex flex-col space-y-2">
        <Link
          href="/dashboard/profile"
          className={linkClass("/dashboard/profile")}
        >
          <CgProfile />
          <span className="font-medium text-xl">Profile</span>
        </Link>
        <Link href="/dashboard/blogs" className={linkClass("/dashboard/blogs")}>
          <ImBlogger2 />
          <span className="font-medium text-xl">Your Blogs</span>
        </Link>
        <Link
          href="/dashboard/comments"
          className={linkClass("/dashboard/comments")}
        >
          <FaComments />
          <span className="font-medium text-xl">Comments</span>
        </Link>
        <Link
          href="/dashboard/write-blog"
          className={linkClass("/dashboard/write-blog")}
        >
          <FaEdit />
          <span className="font-medium text-xl">Create Blog</span>
        </Link>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
