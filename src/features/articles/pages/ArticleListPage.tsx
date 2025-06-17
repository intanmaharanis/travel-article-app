import React, { Suspense } from "react";
import { Button } from "../../../components/ui/button";
import ArticlesCard from "../components/ArticlesCard";
import { useArticleListLogic } from '../../../hooks/useArticleListLogic';
import type { Article } from '../../../types/article';
import ArticleListControls from '../components/ArticleListControls';
import { Loader2Icon, PlusCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

const ArticleFormModal = React.lazy(() => import('../components/ArticleFormModal'));
const ConfirmDeleteDialog = React.lazy(() => import('../../../components/ConfirmDeleteDialog'));

export default function ArticleListPage() {
  const {
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
    setCurrentPage
  } = useArticleListLogic();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Articles</h1>

        <ArticleListControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          showMyArticlesOnly={showMyArticlesOnly}
          setShowMyArticlesOnly={setShowMyArticlesOnly}
          categories={categories}
          isAuthenticated={isAuthenticated}
        />

        <div className="flex justify-end">
        <Button onClick={handleCreateClick} className="bg-purple-600 hover:bg-purple-700 text-white mb-4">
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
            {articles.map((article: Article) => (
              <ArticlesCard 
                key={article.id}
                article={article}
                currentUserId={article?.user?.id}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isAuthenticated={isAuthenticated}
              />            
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevPage}
                  href={currentPage === 1 ? undefined : '#'}
                  size="default"
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                    size="default"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  href={currentPage === totalPages ? undefined : '#'}
                  size="default"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        <Suspense fallback={<div>Loading Article Form...</div>}>
          <ArticleFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={onSubmit}
            editingArticle={editingArticle}
            isSubmitting={isSubmitting}
            loading={loading}
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading Confirmation Dialog...</div>}>
          <ConfirmDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDeleteArticle}
            itemType="article"
            itemName={articles.find(article => article.documentId === articleToDeleteId)?.title || 'this article'}
          />
        </Suspense>

      </div>
    </div>
  );
} 