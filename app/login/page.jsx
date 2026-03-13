"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { TbEyeOff, TbEye } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { ImSpinner2 } from "react-icons/im";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ FIXED — correct slice name
  const { user, loading, message, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(login));
  };

  // ✅ FIXED useEffect
  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (isAuthenticated && user) {
      toast.success(message || "Login successfull!");
      router.push("/");
    }
  }, [error, isAuthenticated, user, message, router]);

  return (
    <section className=" bg-linear-to-b dark:from-gray-900 dark:to-gray-800 from-gray-50 to-white flex items-center justify-center p-4 md:p-0">
      {/* Image Content */}
      <div className="hidden md:block relative w-2/3 h-full">
        <Image
          src="/auth.jpg"
          alt="signUp"
          width={700}
          height={400}
          className="w-[95%] h-164 "
        />
      </div>
      <div className=" md:w-1/3  flex items-center justify-center">
        <Card className="w-full max-w-sm m-2">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Login to your Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Connect Sanika Blogs community and start writing
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="dark:text-white"
                    name="email"
                    value={login.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="dark:text-white"
                    name="password"
                    value={login.password}
                    onChange={handleChange}
                    required
                  />
                  <div
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    className="absolute top-9 right-4 cursor-pointer text-gray-500"
                  >
                    {showPassword ? (
                      <TbEyeOff size={20} />
                    ) : (
                      <TbEye size={20} />
                    )}
                  </div>
                </div>
                <div className="flex-col gap-2">
                  <Button className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <ImSpinner2 className="animate-spin" /> Please Wait...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/signUp"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Login;
