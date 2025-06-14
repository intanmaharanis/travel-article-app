import { useEffect, useState } from 'react'
import { useCategoryStore } from '../../../stores/categoryStore';
import Spinner from '../../../components/ui/spinner';
import CategoryCard from '../../../components/CategoryCard';
import { getRandomIcon } from '../../../constants/icons';
import HeroCategory from '../components/heroCategory';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import CategoryFormModal, { type CategoryFormValues } from '../components/CategoryFormModal';
import { useAuthStore } from '../../../stores/authStore';
import type { Category } from '../../../types/category';

export default function CategoriesPage() {
  const { categories, fetchAllData, loading, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role.id === 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        // Refetch categories to ensure UI is updated after deletion
        fetchAllData();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category.");
      }
    }
  };

  const handleModalSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.documentId, data.name);
      } else {
        await createCategory(data.name);
      }
      setIsModalOpen(false);
      fetchAllData(); // Re-fetch categories after creation/update
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroCategory />

      <div className="container mx-auto py-12 px-4">
      <div className="flex justify-end mb-8">
            <Button onClick={handleCreateCategory} className="bg-purple-600 hover:bg-blue-700 text-white rounded flex items-center mr-4">
              <Plus size={20} className="mr-2" /> Create New Category
            </Button>
          </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-600 text-xl">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-3">
            {categories.map((category,index) => {
            const Icon = getRandomIcon(index);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                Icon={Icon}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            );
          })}
          </div> 
        )}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
