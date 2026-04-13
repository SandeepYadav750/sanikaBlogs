"use client";
import { useRef, useState } from "react";
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
import { createBlog } from "../../../redux/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import JoditEditor from "jodit-react";
import Image from "next/image";

const categories = [
  "Web Application",
  "Web Design",
  "SEO",
  "Digital Application",
  "Mobile Application",
];

const WriteBlog = () => {
  const editor = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, message, error } = useSelector((state) => state.blog);

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

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

    // TODO: Send blogData + imageFile to your API
    const formDataApp = new FormData();
    formDataApp.append("title", blogData.title);
    formDataApp.append("subtitle", blogData.subtitle);
    formDataApp.append("category", blogData.category);
    formDataApp.append("description", blogData.description);

    if (imageFile) {
      formDataApp.append("file", imageFile);
      console.log("form submit", formDataApp, imageFile);
    }

    try {
      const result = await dispatch(createBlog(formDataApp));
      console.log("createBlog result:", result);
      if (createBlog.fulfilled.match(result)) {
        toast.success(result.payload.message);
        const BlogId = result.payload.blog?._id || result.payload._id;
        if (BlogId) {
          // router.push(`/dashboard/write-blog/${BlogId}`);
          router.push(`/dashboard/blogs`);
        }
      } else {
        toast.error(error || "Blog creation failed");
      }
      // if (result.success) {
      //   setComment("");
      //   toast.success(result.message || "Comment added successfully!");
      //   dispatch(fetchComments(blogId));
      // } else {
      //   toast.error(
      //     result.message || "Comment Submit Failed. Please try again.",
      //   );
      // }
    } catch (err) {
      console.error("blog not created", err);
      toast.error("Blog creation failed");
    }
  };

  // const blogselectData = useSelector((state) => state.blog);
  // console.log("blogselectData:", blogselectData);
  // console.log("blogselectDataBlog:", blogselectData.blogs);

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
            <Button>Publish</Button>
            <Button variant="destructive">Remove Blog</Button>
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
              value={blogData.title || ""}
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
              value={blogData.subtitle || ""}
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
              value={blogData.category || ""}
              onValueChange={(value) =>
                setBlogData((prev) => ({ ...prev, category: value }))
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
              value={blogData.description || ""}
              onBlur={(newContent) =>
                setBlogData((prev) => ({
                  ...prev,
                  description: newContent,
                }))
              }
            />
            {/* <textarea
              id="description"
              name="description"
              value={blogData.description}
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
    </div>
  );
};

export default WriteBlog;
