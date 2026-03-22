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
import { updateBlog } from "../../../../redux/blogSlice";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import Image from "next/image";

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
  const { blog, blogs, loading, message, error } = useSelector(
    (store) => store.blog,
  );
  // Solution: Convert both to string for comparison
  const selectBlogData = blogs.find((blog) => String(blog._id) === String(id));
  // console.log("blog", blog);
  // console.log("blogs", blogs);
  // console.log("selectBlogData", selectBlogData);

  const [formData, setFormData] = useState({
    title: selectBlogData?.title,
    subtitle: selectBlogData?.subtitle,
    description: selectBlogData?.description,
    category: selectBlogData?.category,
  });

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
      dispatch(updateBlog({ id, data: formDataApp }));

      if (!error) {
        toast.success(message);
        router.push(`/dashboard/blogs/${id}`);
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  if (!blog) {
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
    </div>
  );
};

export default blogId;
