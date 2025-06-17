import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useArticleStore } from "../stores/articleStore";
import { useCategoryStore } from "../stores/categoryStore";
import type { Article } from '../types/article';
import type { ArticleFormValues } from '../features/articles/components/ArticleFormModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./useAuth";

export const useArticleListLogic = () => {
  const { articles, fetchArticles, loading, currentPage, totalPages, setCurrentPage, createArticle, updateArticle, deleteArticle, pageSize } = useArticleStore();
  const { categories, fetchAllData: fetchCategories } = useCategoryStore();
  const {isAuthenticated, user} = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(null);
  const [showMyArticlesOnly, setShowMyArticlesOnly] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, categories.length]);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearchTerm !== searchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
  
    if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm === '') {
      fetchArticles(selectedCategoryId, currentPage, pageSize, debouncedSearchTerm, showMyArticlesOnly ? String(user?.id) : undefined);
    }
  }, [fetchArticles, selectedCategoryId, currentPage, debouncedSearchTerm, pageSize, showMyArticlesOnly, user?.id]);

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const articleToEdit = articles.find(article => article.documentId === articleId);
    if (articleToEdit) {
      if (user?.id === articleToEdit.user?.id) {
        setEditingArticle(articleToEdit);
        setIsModalOpen(true);
      } else {
        toast.error('Kamu hanya bisa edit article sendiri.');
      }
    }
  };

  const handleDeleteClick = (articleId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const articleToDelete = articles.find(article => article.documentId === articleId);
    if (articleToDelete) {
      if (user?.id === articleToDelete.user?.id) {
        setArticleToDeleteId(articleId);
        setIsDeleteDialogOpen(true);
      } else {
        toast.error('Kamu hanya bisa hapus article sendiri.');
      }
    }
  };

  const confirmDeleteArticle = async () => {
    if (articleToDeleteId) {
      try {
        await deleteArticle(articleToDeleteId);
        toast.success('Article deleted successfully');
      } catch (error: unknown) {
        toast.error((error instanceof Error) ? error.message : 'Failed to delete article');
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
      fetchArticles(selectedCategoryId, currentPage, pageSize, debouncedSearchTerm, showMyArticlesOnly ? String(user?.id) : undefined);
    } catch (error: unknown) {
      toast.error((error instanceof Error) ? error.message : 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    articles,
    loading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    showMyArticlesOnly,
    setShowMyArticlesOnly,
    handleNextPage,
    handlePrevPage,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    confirmDeleteArticle,
    onSubmit,
    isModalOpen,
    setIsModalOpen,
    editingArticle,
    isSubmitting,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    articleToDeleteId,
    categories,
    isAuthenticated,
    user:user?.id,
    setCurrentPage,
  };
}; 