import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const user = true;
  return (
    <div className="py-4 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-b-2 bg-white text-black z-50">
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
              <h1 className=" px-3 py-1 rounded-md font-bold text-3xl md:text-4xl">
                Logo
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
            <Link href="/" className="cursor-pointer px-3 py-1 rounded-md">
              <li>Home</li>
            </Link>
            <Link
              href="/blogs"
              className={`cursor-pointer px-3 py-1 rounded-md`}
            >
              <li>Blogs</li>
            </Link>
            <Link
              href="/about"
              className={`cursor-pointer px-3 py-1 rounded-md`}
            >
              <li>About</li>
            </Link>
            {/* <NavLink to={'/write-blog'} className={`cursor-pointer text-white px-3 py-1 rounded-md`}><li>Write a Blog</li></NavLink> */}
          </ul>
          <div className="flex">
            <Button className="">
              {/* {theme === "light" ? <FaMoon /> : <FaSun />} */}
              <FaMoon />
            </Button>
            {user ? (
              <Avatar className="ml-7 flex gap-3 items-center">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
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
