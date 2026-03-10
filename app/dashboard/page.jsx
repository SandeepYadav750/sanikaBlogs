"use client";
import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.displayName || user?.name || "User";
  const aboutText =
    user?.about ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  const stats = [
    { title: "Total Views", value: "24.8K", change: "+12% from last month" },
    { title: "Total Blogs", value: "8", change: "+4% from last month" },
    { title: "Comments", value: "0", change: "+18% from last month" },
    { title: "Likes", value: "0", change: "+7% from last month" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 flex gap-6 bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 space-y-6">
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Avatar className="w-28 h-28">
            <AvatarImage src={user?.photoURL || "/avatar.png"} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome {displayName}!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Email : {user?.email}
            </p>
            <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {aboutText}
              </p>
            </div>
            <Button className="mt-4">Edit Profile</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-4">
              <CardContent>
                <CardTitle className="text-lg">{stat.title}</CardTitle>
                <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
                <CardDescription className="mt-1">
                  {stat.change}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
