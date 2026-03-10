"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { X } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    facebook: initialData?.facebook || "",
    instagram: initialData?.instagram || "",
    linkedin: initialData?.linkedin || "",
    github: initialData?.github || "",
    description: initialData?.description || "",
    photoURL: initialData?.photoURL || "",
  });

  const [imagePreview, setImagePreview] = useState(initialData?.photoURL || "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          photoURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start md:items-center justify-center p-4">
      <Card className="bg-white p-2 rounded-md relative top-2 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
          <div>
            <CardTitle className="text-xl">Edit Profile</CardTitle>
            <CardDescription>
              Make changes to your profile here.
            </CardDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <CardContent className="space-y-4 p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Rohit"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Singh"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook" className="text-sm font-medium">
                Facebook
              </Label>
              <Input
                id="facebook"
                name="facebook"
                type="url"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="Enter a URL"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="instagram" className="text-sm font-medium">
                Instagram
              </Label>
              <Input
                id="instagram"
                name="instagram"
                type="url"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="Enter a URL"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://www.linkedin.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="github" className="text-sm font-medium">
                Github
              </Label>
              <Input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/sandeep"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
              rows="4"
            />
          </div>

          <div>
            <Label htmlFor="picture" className="text-sm font-medium">
              Picture
            </Label>
            <div className="mt-2">
              {imagePreview && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-4">
                <input
                  id="picture"
                  name="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Choose File
                </span>
              </label>
              {!imagePreview && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  No file chosen
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end gap-2 p-2 border-t dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-black dark:bg-white text-white dark:text-black"
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditProfileModal;
