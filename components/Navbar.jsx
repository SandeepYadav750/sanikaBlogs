"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Menu } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { ImBlogger2 } from "react-icons/im";
import { FaComments } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerms, setSearchTerms] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerms.trim() !== "") {
      router.push(`/searchList?q=${encodeURIComponent(searchTerms)}`);
      setSearchTerms("");
      setMobileSearchOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const { user, error } = useSelector((state) => state.auth);

  const { theme } = useSelector((state) => state.theme);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Get user display name or email
  const getUserDisplayName = () => {
    if (user?.user?.firstName && user?.user?.lastName)
      return `${user?.user.firstName} ${user?.user.lastName}`;
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (user?.user?.photoURL) return user.user.photoURL;
    if (user?.photoURL) return user.photoURL;
    return "https://github.com/shadcn.png";
  };

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
  ];

  // Dashboard links for mobile
  const dashboardLinks = [
    { href: "/dashboard/profile", label: "Profile", icon: CgProfile },
    { href: "/dashboard/blogs", label: "Your Blogs", icon: ImBlogger2 },
    { href: "/dashboard/comments", label: "Comments", icon: FaComments },
    { href: "/dashboard/write-blog", label: "Write Blogs", icon: FaEdit },
  ];

  return (
    <>
      <div className="py-3 fixed w-full dark:bg-gray-900/95 bg-white/95 backdrop-blur-md dark:border-b-gray-700 border-b-gray-200 border-b shadow-sm z-50">
        <div className="md:max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6">
          {/* Logo Section */}
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
          >
            Logo
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                onClick={handleSearch}
                className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-indigo-600 transition-colors"
              />
              <Input
                type="text"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search articles..."
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-4 pr-10 rounded-full focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium ${
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => dispatch(toggleTheme())}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === "light" ? (
                  <FaMoon className="w-4 h-4" />
                ) : (
                  <FaSun className="w-4 h-4" />
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-indigo-500 transition-all duration-300">
                      <AvatarImage src={getUserAvatar()} alt="Avatar" />
                      <AvatarFallback className="bg-linear-to-r from-indigo-500 to-purple-500 text-white">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold text-sm">
                          {getUserDisplayName()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || user?.user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {dashboardLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            <link.icon className="mr-2 h-4 w-4" />
                            <span>{link.label}</span>
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logoutHandler}
                      className="text-red-600 cursor-pointer"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signUp">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      Signup
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Header Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              onClick={() => dispatch(toggleTheme())}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {theme === "light" ? (
                <FaMoon className="w-4 h-4" />
              ) : (
                <FaSun className="w-4 h-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 sm:w-87.5 p-0">
                <div className="flex flex-col h-full">
                  {/* User Profile Section */}
                  {user ? (
                    <SheetTitle>
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-14 w-14 ring-2 ring-indigo-500">
                            <AvatarImage src={getUserAvatar()} />
                            <AvatarFallback className="bg-linear-to-r from-indigo-500 to-purple-500 text-white text-lg">
                              {getUserDisplayName().charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {getUserDisplayName()}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user?.email || user?.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SheetTitle>
                  ) : (
                    <SheetTitle>
                      <div className="">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                          <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button className="w-full rounded-full">
                              Login
                            </Button>
                          </Link>
                          <Link
                            href="/signUp"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full rounded-full"
                            >
                              Signup
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </SheetTitle>
                  )}

                  {/* Navigation Links */}
                  <div className="flex-1 py-4">
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Navigation
                      </h4>
                      <div className="space-y-1">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                              pathname === link.href
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {user && (
                      <div className="px-4 py-2 mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Dashboard
                        </h4>
                        <div className="space-y-1">
                          {dashboardLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <link.icon className="h-4 w-4" />
                              <span>{link.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Logout Button for Mobile */}
                  {user && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={logoutHandler}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pt-3 pb-2 animate-in slide-in-from-top-2 duration-200">
            <div className="relative w-full">
              <Search
                onClick={handleSearch}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-indigo-600 transition-colors"
              />
              <Input
                type="text"
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
                // onKeyPress={handleKeyPress}
                placeholder="Search articles..."
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pl-4 pr-10 rounded-full focus:ring-2 focus:ring-indigo-500 transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-16"></div>
    </>
  );
};

export default Navbar;
