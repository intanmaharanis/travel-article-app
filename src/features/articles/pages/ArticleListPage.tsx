import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useArticleStore } from "../../../stores/articleStore";
import { useCategoryStore } from "../../../stores/categoryStore";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Filter, Search, PlusCircle, Loader2Icon } from "lucide-react";
import ArticlesCard from "../components/ArticlesCard";
import ArticleFormModal from '../components/ArticleFormModal';
import type { Article } from '../../../types/article';
import type { ArticleFormValues } from '../components/ArticleFormModal';
import { toast } from "sonner";
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';

export default function ArticleListPage() {
  const { articles, fetchArticles, loading, currentPage, totalPages, setCurrentPage, createArticle, updateArticle, deleteArticle, pageSize } = useArticleStore();
  const { categories, fetchAllData: fetchCategories } = useCategoryStore();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
      fetchArticles(selectedCategoryId, currentPage, pageSize, debouncedSearchTerm);
    }
  }, [fetchArticles, selectedCategoryId, currentPage, debouncedSearchTerm, pageSize]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCreateClick = () => {
    if (isAuthenticated) {
      setEditingArticle(null);
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleEditClick = (articleId: string) => {
    const articleToEdit = articles.find(article => article.documentId === articleId);
    if (articleToEdit) {
      setEditingArticle(articleToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (articleId: string) => {
    setArticleToDeleteId(articleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (articleToDeleteId) {
      try {
        await deleteArticle(articleToDeleteId);
        toast.success('Article deleted successfully');
        fetchArticles(selectedCategoryId, currentPage, pageSize, debouncedSearchTerm);
      } catch (error: any) {
        console.error('Error deleting article:', error);
        toast.error(error.message || 'Failed to delete article');
      } finally {
        setIsDeleteDialogOpen(false);
        setArticleToDeleteId(null);
      }
    }
  };

  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.documentId, data);
        toast.success('Article updated successfully');
      } else {
        await createArticle(data);
        toast.success('Article created successfully');
      }
      setIsModalOpen(false);
      fetchArticles(selectedCategoryId, currentPage, pageSize, debouncedSearchTerm);
    } catch (error) {
      console.error('Error submitting article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Articles</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex w-full md:w-auto space-x-4">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full"
              />
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Select onValueChange={(value: string) => setSelectedCategoryId(value === "-1" ? "" : value)} value={selectedCategoryId}>
              <SelectTrigger className="w-full md:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleCreateClick} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center px-6 py-2 rounded-md">
            <PlusCircle size={20} className="mr-2" />
            Create New Article
          </Button>

        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2Icon className="animate-spin w-10 h-10 text-gray-500" />
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-600 text-xl mt-12">No articles found for the current filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticlesCard 
                key={article.id}
                article={article}
                currentUserId={user?.id}
                isAuthenticated={isAuthenticated}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />            
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}

        <ArticleFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onSubmit}
          editingArticle={editingArticle}
          isSubmitting={isSubmitting}
          loading={loading}
        />

        <ConfirmDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteArticle}
          itemType="article"
          itemName={articles.find(article => article.documentId === articleToDeleteId)?.title || 'this article'}
        />

      </div>
    </div>
  );
} 