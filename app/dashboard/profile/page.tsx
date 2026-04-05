"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import EditProfileModal from "@/components/EditProfileModal";
import TotalProperty from "@/components/TotalProperty";

const Profile = () => {
  const { user } = useSelector((state: any) => state.auth.user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const displayName = user.firstName + " " + user.lastName || " Guest User";

  return (
    <div className="max-w-7xl mx-auto px-4 flex gap-6 bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 space-y-6">
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-28 h-28">
              <AvatarImage src={user.photoURL || "/avatar.png"} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{user.occupation}</span>
            <div className="flex items-center justify-center gap-2 text-xl w-full">
              <Link href={user.facebook} target="_blank">
                <FaFacebook />
              </Link>
              <Link href={user.twitter} target="_blank">
                <FaSquareXTwitter />
              </Link>
              <Link href={user.linkedin} target="_blank">
                <FaLinkedin />
              </Link>
              <Link href={user.instagram} target="_blank">
                <FaSquareInstagram />
              </Link>
            </div>
          </div>
          <div className="flex-1 ">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome {displayName || "N/A"}
            </h2>
            <p className="my-2 text-sm text-gray-600 dark:text-gray-300">
              Email : {user.email || "N/A"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              <span className="font-medium">About Me:</span>
            </p>
            <div className=" p-4 bg-gray-200 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {user.bio}
              </p>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} className="mt-4">
              Edit Profile
            </Button>
          </div>
        </Card>

        <TotalProperty />
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // initialData={user?.user}
        // onSave={(data: any) => {
        //   console.log("Profile updated:", data);
        //   dispatch(setUser(data));
        // }}
      />
    </div>
  );
};

export default Profile;
