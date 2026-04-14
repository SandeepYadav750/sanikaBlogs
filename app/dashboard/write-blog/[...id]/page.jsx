"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JoditEditor from "jodit-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePublishBlog,
  fetchPublishedBlogs,
  updateBlog,
  deleteBlog,
} from "@/redux/blogSlice";
import { ImSpinner2 } from "react-icons/im";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = [
  "Web Application",
  "Web Design",
  "SEO",
  "Digital Application",
  "Mbile Application",
];

const blogId = () => {
  const editor = useRef(null);
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const { blog, blogs, publishedBlogs, loading, message, error } = useSelector(
    (store) => store.blog,
  );
  // Solution: Convert both to string for comparison
  const selectBlogData = blogs.find((blog) => String(blog._id) === String(id));
  // console.log("publishedBlogs", publishedBlogs);
  const [formData, setFormData] = useState({
    title: selectBlogData?.title,
    subtitle: selectBlogData?.subtitle,
    description: selectBlogData?.description,
    category: selectBlogData?.category,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(selectBlogData?.thumbnail);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Send formData + imageFile to your API
    const formDataApp = new FormData();
    formDataApp.append("title", formData.title);
    formDataApp.append("subtitle", formData.subtitle);
    formDataApp.append("category", formData.category);
    formDataApp.append("description", formData.description);

    if (imageFile) {
      formDataApp.append("file", imageFile);
      console.log("form submit", formDataApp, imageFile);
    }

    try {
      const result = await dispatch(updateBlog({ id, data: formDataApp }));
      console.log("updateBlog result:", result);
      if (updateBlog.fulfilled.match(result)) {
        toast.success(result.payload.message);
        router.push("/dashboard/blogs");
      } else {
        toast.error(error || "Blog creation failed");
      }
      // if (!error) {
      //   toast.success(message);
      //   router.push(`/blog/${id}`);
      // } else {
      //   toast.error(error);
      // }
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  const togglePublish = async () => {
    try {
      const result = await dispatch(togglePublishBlog(selectBlogData?._id));
      // console.log("selectBlogData?._id", selectBlogData?._id);
      console.log("togglePublish result:", result);
      if (togglePublishBlog.fulfilled.match(result)) {
        toast.success(result.payload.data.message);
      } else {
        toast.error(result.payload.data.message || "failed to published");
      }
      // if (result.data.success) {
      //   setPublish(!publish);
      //   toast.success(result.data.message || "blog publish");
      //   // router.push("/dashboard/blogs");
      //   console.log("selectBlogDatasuccess", selectBlogData);
      // } else {
      //   toast.error(result.data.message || "failed to published");
      // }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  // Handle delete click
  const handleDeleteClick = (blogId) => {
    setSelectedBlogId(blogId);
    setDeleteDialogOpen(true);
    console.log("blogId", blogId);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedBlogId) return;
    setIsDeleting(true);
    try {
      const result = await dispatch(deleteBlog(selectedBlogId));
      console.log("selectedBlogId", selectedBlogId);

      console.log("result", result);
      toast.error(error);

      if (deleteBlog.fulfilled.match(result)) {
        toast.success(result.payload.message);
        // Refresh the blog list
        router.push("/dashboard/blogs");
      } else {
        toast.error(result.payload.data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!blogs || !blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="rounded-md border border-slate-600 bg-white dark:bg-gray-900 p-5 md:p-7 ">
        <div className="mb-5">
          <h1 className="text-3xl md:text-4xl font-bold">
            Basic Blog Information
          </h1>
          <p className="mt-2 text-sm md:text-base">
            Makes changes to your blog here. click publish when you are done.
          </p>
          <div className="space-x-2 mt-2">
            {/* <Button
              onClick={() =>
                togglePublish(selectBlogData.isPublished ? "false" : "true")
              }
              disabled={loading}
              variant={selectBlogData.isPublished ? "destructive" : "default"}
            >
              {loading ? (
                <>
                  <ImSpinner2 className="animate-spin mr-2" />
                  {selectBlogData.isPublished
                    ? "Unpublishing..."
                    : "Publishing..."}
                </>
              ) : selectBlogData.isPublished ? (
                "UnPublish"
              ) : (
                "Publish"
              )}
            </Button> */}
            <Button
              onClick={() =>
                togglePublish(selectBlogData.isPublished ? "false" : "true")
              }
            >
              {selectBlogData.isPublished ? "UnPublish" : "Publish"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteClick(selectBlogData?._id)}
            >
              Remove Blog
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1 block text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              placeholder="Your Blog Name"
              className="w-full border-slate-600 shadow-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="subtitle"
              className="mb-1 block text-sm font-medium"
            >
              SubTitle
            </Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={formData.subtitle || ""}
              onChange={handleInputChange}
              placeholder="Your Blog SubTitle"
              className="w-full border-slate-600 shadow-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="category"
              className="mb-1 block text-sm font-medium "
            >
              Category
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              className="w-1/4 rounded-md border border-slate-600  py-2 px-3 outline-none focus:border-indigo-400"
            >
              <SelectTrigger className="w-full max-w-48 border border-slate-600">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((cat) => (
                    <SelectItem value={cat} key={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </Label>
            <JoditEditor
              ref={editor}
              className="jodit-editor"
              value={formData.description || ""}
              onBlur={(newContent) =>
                setFormData((prev) => ({
                  ...prev,
                  description: newContent,
                }))
              }
            />
            {/* <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Enter blog description"
              className="w-full rounded-md border border-slate-600 p-2 outline-none focus:border-indigo-400"
              required
            /> */}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Label
                htmlFor="coverImage"
                className="mb-1 block text-sm font-medium "
              >
                Cover Image
              </Label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white file:font-semibold hover:file:bg-indigo-500"
              />
            </div>
            <div className="pt-6 md:pt-2">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  className="h-40 w-80 outline"
                  width={80}
                  height={48}
                  unoptimized={true}
                />
              ) : (
                <div className="h-28 w-full max-w-xs rounded-md border border-dashed border-slate-500 flex items-center justify-center text-xs">
                  Image preview will appear here
                </div>
              )}
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit" disabled={loading} className="mt-2 ">
              {loading ? (
                <>
                  <ImSpinner2 className="animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>
      {/* Enhanced Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <FiTrash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="w-full text-center text-xl font-bold text-gray-900 dark:text-white">
              Delete Blog Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this blog post? This action cannot
              be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isDeleting ? (
                <>
                  <ImSpinner2 className="animate-spin mr-2" /> Deleting...
                </>
              ) : (
                "Delete Forever"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default blogId;
