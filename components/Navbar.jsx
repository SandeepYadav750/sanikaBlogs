"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { toast } from "react-toastify";
import { logoutUser } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { ImBlogger2 } from "react-icons/im";
import { FaComments } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerms, setSearchTerms] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerms.trim() !== "") {
      router.push(`/searchList?q=${encodeURIComponent(searchTerms)}`);
      setSearchTerms("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const { user, token, expiresIn, isAuthenticated, message, error, loading } =
    useSelector((state) => state.auth);

  console.log("Navbar - Auth State:", {
    user,
    loading,
    message,
    error,
    isAuthenticated,
    tokenPresent: token,
    hasToken: !!token,
    expiresIn,
  });

  const { theme } = useSelector((state) => state.theme);

  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Get user display name or email
  const getUserDisplayName = () => {
    if (user?.user?.firstName && user?.user?.lastName)
      return `${user?.user.firstName} ${user?.user.lastName}`;
    return "User";
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (user?.user?.photoURL) return user.user.photoURL;
    if (user?.photoURL) return user.photoURL;
    return "https://github.com/shadcn.png";
  };

  return (
    <div className="py-4 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-b-2 bg-white z-50">
      <div className="md:max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* Logo Section */}
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Logo
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search
              onClick={handleSearch}
              className="absolute cursor-pointer right-0 p-2 rounded-md top-1/2 transform -translate-y-1/2 text-gray-400 w-9 h-9 bg-gray-300 dark:bg-gray-700"
            />
            <Input
              type="text"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search..."
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            About
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {/* Check both isAuthenticated AND token exists */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="ml-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={getUserAvatar()} alt="Avatar" />
                    <AvatarFallback>
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {getUserDisplayName()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || user?.user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/dashboard/profile">
                      <DropdownMenuItem>
                        <CgProfile className="mr-2" />
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/blogs">
                      <DropdownMenuItem>
                        <ImBlogger2 className="mr-2" />
                        Your Blogs
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/comments">
                      <DropdownMenuItem>
                        <FaComments className="mr-2" />
                        Comments
                        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/write-blog">
                      <DropdownMenuItem>
                        <FaEdit className="mr-2" />
                        Write Blogs
                        <DropdownMenuShortcut>⌘WB</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="text-red-600"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="ml-2 flex gap-2">
                <Link href="/login">
                  <Button variant="default">Login</Button>
                </Link>
                <Link href="/signUp">
                  <Button variant="outline">Signup</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
