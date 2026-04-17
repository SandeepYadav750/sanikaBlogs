"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { FiTrash2 } from "react-icons/fi";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  // clearError,
} from "@/redux/categorySlice";
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

const Category = () => {
  const dispatch = useDispatch();
  const { categories, loading, totalCategories } = useSelector(
    (state) => state.category,
  );

  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //for open dialog box
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Show error toast if error occurs
  // useEffect(() => {
  //   if (error) {
  //     toast.error(error);
  //     dispatch(clearError());
  //   }
  // }, [error, dispatch]);

  // Handle Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    const categoryName = newCategory.trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(
        createCategory({ name: categoryName }),
      ).unwrap();
      toast.success(result.message || "Category added successfully");
      setNewCategory("");
    } catch (err) {
      toast.error(err || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  // Handle Delete Category
  const confirmDelete = async () => {
    if (!selectedBlogId) return;
    setIsDeleting(true);

    try {
      await dispatch(deleteCategory(selectedBlogId)).unwrap();
      toast.success("Category deleted successfully");
      // Refetch categories to get Deleted list
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle Edit Category
  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  // Handle Save Edit
  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      await dispatch(updateCategory({ id, name: editingName })).unwrap();
      toast.success("Category updated successfully");
      setEditingId(null);
      setEditingName("");
      // Refetch categories to get updated list
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to update category");
    }
  };

  // Filter categories based on search - WITH NULL CHECK
  const filteredCategories = categories.filter((cat) => {
    // Skip if cat is null or undefined
    if (!cat || !cat.name) return false;
    return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort blogs (all blogs from fetchAllBlogs)
  const sortedBlogs =
    filteredCategories?.length > 0
      ? [...filteredCategories].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
                Organize your blog posts with smart categories
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{totalCategories || 0} Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create New Category
                </h2>
              </div>
              <form onSubmit={handleAddCategory} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    disabled={submitting}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all disabled:opacity-50"
                    placeholder="e.g., Technology, Travel, Food"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding..." : "Add Category"}
                </button>
              </form>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Categories
                  </span>
                  <span className="font-bold text-2xl text-blue-600">
                    {totalCategories || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Loading Status
                  </span>
                  <span className="text-sm text-gray-500">
                    {loading ? "Loading..." : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Categories List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      Loading categories...
                    </p>
                  </div>
                ) : sortedBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No matching categories found"
                        : "No categories yet"}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm text-gray-400 mt-2">
                        Add your first category using the form
                      </p>
                    )}
                  </div>
                ) : (
                  sortedBlogs.map((category) => {
                    // Additional null check before rendering
                    if (!category || !category._id) return null;

                    return (
                      <div
                        key={category._id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase">
                              {category.name ? category.name.charAt(0) : "?"}
                            </div>
                            {editingId === category._id ? (
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveEdit(category._id)}
                                  className="p-1 text-green-600 hover:text-green-700"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {category.name || "Unnamed Category"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  ID:{" "}
                                  {category._id
                                    ? category._id.slice(-6)
                                    : "N/A"}
                                </p>
                              </div>
                            )}
                          </div>
                          {editingId !== category._id && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  handleEdit(category._id, category.name)
                                }
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {sortedBlogs.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {sortedBlogs.length} of {categories.length}{" "}
                      categories
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="sm:max-w-md rounded-2xl">
            <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <FiTrash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="w-full text-center text-xl font-bold text-gray-900 dark:text-white">
                Delete Category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this category? This action
                cannot be undone and will permanently remove all associated
                data.
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
    </div>
  );
};

export default Category;
