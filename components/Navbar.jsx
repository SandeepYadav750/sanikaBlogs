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
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <Link href="/">
            <div className="flex gap-2 items-center">
              <Image
                src="/logo.png"
                alt="logo"
                className="w-7 h-7 md:w-10 md:h-10 dark:invert"
                width={20}
                height={20}
              />
              <h1 className="px-3 py-1 rounded-md font-bold text-3xl md:text-4xl">
                Logos
              </h1>
            </div>
          </Link>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search"
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-75 hidden md:block"
            />
            <Button className="absolute right-0 top-0">
              <Search className="w-4 h-4 pointer-cursor" />
            </Button>
          </div>
        </div>
        {/* nav section */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/blogs" className={linkClass("/blogs")}>
              Blogs
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
          </ul>
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
                        src={user.user?.photoURL || "https://github.com/shadcn.png"}
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
