"use client";
import Image from "next/image";
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
import { useEffect } from "react";
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
  const linkClass = (href) => {
    const base = "cursor-pointer px-3 py-1 rounded-md";
    const active = pathname === href || pathname.startsWith(href + "/");
    return `${base} ${
      active
        ? "bg-gray-200 dark:bg-gray-700"
        : "hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;
  };

  const { user, isAuthenticated, message, error } = useSelector(
    (state) => state.auth,
  );
  const { theme } = useSelector((state) => state.theme);

  const logoutHandler = () => {
    router.push("/login");
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (message && !isAuthenticated) {
      toast.success(message);
      console.log("Logout message:", message);
      console.log("Logout user:", user);
    }

    if (error) {
      toast.error(error);
    }
  }, [message, error, isAuthenticated]);

  return (
    <div className="py-4 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-b-2 bg-white z-50">
      <div className="md:max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Logo
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
          <div className="flex">
            <Button className="" onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="mx-4 flex gap-3 items-center"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          user.user?.photoURL || "https://github.com/shadcn.png"
                        }
                        alt="Avatar"
                      />
                      <AvatarFallback>SY</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <Link
                        href="/dashboard/profile"
                        className={`w-full ${
                          pathname === "/dashboard/profile" ||
                          pathname.startsWith("/dashboard/profile/")
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <DropdownMenuItem>
                          <CgProfile />
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href="/dashboard/blogs"
                        className={`w-full ${
                          pathname === "/dashboard/blogs" ||
                          pathname.startsWith("/dashboard/blogs/")
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <DropdownMenuItem>
                          <ImBlogger2 />
                          Your Blogs
                          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href="/dashboard/comments"
                        className={`w-full ${
                          pathname === "/dashboard/comments" ||
                          pathname.startsWith("/dashboard/comments/")
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <DropdownMenuItem>
                          <FaComments />
                          Comments
                          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href="/dashboard/write-blog"
                        className={`w-full ${
                          pathname === "/dashboard/write-blog" ||
                          pathname.startsWith("/dashboard/write-blog/")
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                      >
                        <DropdownMenuItem>
                          <FaEdit />
                          Write Blogs
                          <DropdownMenuShortcut>⌘WB</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {/* <Button > */}
                      <DropdownMenuItem onClick={logoutHandler}>
                        <FiLogOut />
                        Logout
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      {/* </Button> */}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* <Button onClick={logoutHandler}>Logout</Button> */}
              </>
            ) : (
              <div className="ml-7 md:flex gap-2 ">
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
                <Link className="hidden md:block" href="/signUp">
                  <Button>Signup</Button>
                </Link>
              </div>
            )}
          </div>
          {/* {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )} */}
        </nav>
        {/* <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler}/>  */}
      </div>
    </div>
  );
};

export default Navbar;
