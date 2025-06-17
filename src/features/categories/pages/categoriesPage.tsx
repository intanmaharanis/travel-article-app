import React, { useEffect, useState, Suspense } from 'react'
import { useCategoryStore } from '../../../stores/categoryStore';
import CategoryCard from '../components/CategoryCard';
import { getRandomIcon } from '../../../constants/icons';
import HeroCategory from '../components/HeroCategory';
import { Button } from '../../../components/ui/button';
import { Plus,  Loader2Icon } from 'lucide-react';
import type { Category, CategoryFormValues } from '../../../types/category';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const CategoryFormModal = React.lazy(() => import('../components/CategoryFormModal'));

export default function CategoriesPage() {
  const { categories, fetchAllData, loading, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateCategory = () => {
    if (isAuthenticated) {
      setEditingCategory(null);
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted successfully');
    } catch (error: unknown) {
      console.error("Error deleting category:", error);
      toast.error((error instanceof Error) ? error.message : 'Failed to delete category.');
    }
  };

  const handleModalSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.documentId, data.name, data.description);
      } else {
        await createCategory(data.name, data.description);
      }
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      toast.error((error instanceof Error) ? error.message : 'Failed to save category.');
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
            <Loader2Icon className="animate-spin w-10 h-10 text-gray-500" />
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
                isAuthenticated={isAuthenticated}
              />
            );
          })}
          </div> 
        )}
      </div>

      <Suspense fallback={<div>Loading Category Form...</div>}>
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          } }
          editingCategory={editingCategory}
          onSubmit={handleModalSubmit}
          isSubmitting={isSubmitting} loading={false}      />
      </Suspense>
    </div>
  )
}
