"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaEdit,
  FaComments,
  FaPlusCircle,
  FaFolderOpen,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { ImBlogger2 } from "react-icons/im";
import { BiCategoryAlt } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { logoutUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      router.push("/login");
      setMobileMenuOpen(false);
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  const linkClass = (href) => {
    const isActive =
      pathname === href ||
      (href !== "/dashboard" && pathname?.startsWith(href));
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-md"
        : "dark:text-gray-300 hover:bg-gray-100 dark:hover:text-blue-500 hover:translate-x-1"
    }`;
  };

  const navItems = [
    // {
    //   href: "/dashboard",
    //   icon: <MdSpaceDashboard className="text-xl" />,
    //   label: "Dashboard",
    // },
    {
      href: "/dashboard/profile",
      icon: <CgProfile className="text-xl" />,
      label: "Profile",
    },
    {
      href: "/dashboard/blogs",
      icon: <ImBlogger2 className="text-xl" />,
      label: "Your Blogs",
      badge: 12,
    },
    {
      href: "/dashboard/comments",
      icon: <FaComments className="text-xl" />,
      label: "Comments",
      badge: 5,
    },
    {
      href: "/dashboard/write-blog",
      icon: <FaEdit className="text-xl" />,
      label: "Create Blog",
    },
    {
      href: "/dashboard/category",
      icon: <BiCategoryAlt className="text-xl" />,
      label: "Categories",
    },
  ];

  return (
    <aside className="hidden md:block sticky top-4 h-[calc(100vh-2rem)] w-72 bg-white dark:bg-black shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">SB</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Sanika Blogs
            </h1>
            <p className="text-xs text-gray-400">Dashboard Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Main Menu
        </p>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href)}
            >
              {item.icon}
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-700 dark:border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/dashboard/write-blog"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white text-sm hover:shadow-lg transition-all"
          >
            <FaPlusCircle size={14} />
            <span>New Blog</span>
          </Link>
          <Link
            href="/dashboard/category"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-all"
          >
            <FaFolderOpen size={14} />
            <span>Category</span>
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t  border-gray-700 dark:border-gray-100 mt-auto">
        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-2"
        >
          <HiOutlineLogout className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          © 2026 SanikaBlogs
          <br />
          sandyVersion 2.0.0
        </p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
