"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { TbEyeOff, TbEye } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/authSlice";
import { ImSpinner2 } from "react-icons/im";
import ProtectedRoute from "@/components/ProtectedRoute";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, message, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  // console.log("REDUX STATE:", { message, error });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(user));
  };

  const userData = useSelector((state) => state.auth.user);
  console.log("userData", userData);
  // ✅ FIXED useEffect
  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (isAuthenticated && userData) {
      toast.success(message || "Registration successfull!");
      router.push("/dashboard/profile");
    }
  }, [error, userData, isAuthenticated, message, router]);

  return (
    <ProtectedRoute requireAuth={false}>
      <section className="bg-linear-to-b dark:from-gray-900 dark:to-gray-800 from-gray-50 to-white flex items-center justify-center p-4 md:p-0">
        {/* Image Content */}
        <div className="hidden md:block relative w-2/3 h-full">
          <Image
            src="/auth.jpg"
            alt="signUp"
            width={700}
            height={400}
            className="w-[95%] h-164"
          />
        </div>
        <div className=" md:w-1/3 flex items-center justify-center">
          <Card className="w-full max-w-sm m-2">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Join Sanika Blogs community and start writing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-3">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-2"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your First Name"
                        className="dark:text-white"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-2"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your Last Name"
                        className="dark:text-white"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="dark:text-white"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2 relative">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password (min. 6 characters)"
                      className="dark:text-white pr-10"
                      name="password"
                      value={user.password}
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
                        "Sign Up"
                      )}
                    </Button>
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      Already have an account?
                      <Link
                        href="/login"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default SignUp;
