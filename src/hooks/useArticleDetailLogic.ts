import { useEffect, useState } from 'react';
import { useArticleStore } from '../stores/articleStore';
import { useAuth } from './useAuth';
import type { Comment } from '../types/comment';

export const useArticleDetailLogic = (documentId: string | undefined) => {
  const { currentArticle, fetchArticleById, loading, fetchArticles } = useArticleStore();
  const { isAuthenticated, user } = useAuth();
  const [showFullContent, setShowFullContent] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (documentId) {
      fetchArticleById(documentId);
    }
  }, [documentId, fetchArticleById]);

  useEffect(() => {
    if (currentArticle && currentArticle.category && currentArticle.category.name) {
      fetchArticles(currentArticle.category.name);
    }
  }, [currentArticle, fetchArticles]);

  useEffect(() => {
    if (currentArticle?.comments) {
      setComments(currentArticle.comments);
    }
  }, [currentArticle?.comments]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(prev => prev.map(comment => 
      comment.documentId === updatedComment.documentId ? updatedComment : comment
    ));
  };

  const handleCommentDeleted = (commentDocumentId: string) => {
    setComments(prev => prev.filter(comment => comment.documentId !== commentDocumentId));
  };

  const handleLoadMore = () => {
    setShowFullContent(true);
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        // Instagram does not have a direct web share intent for posts, 
        // usually requires app or direct upload. This is a placeholder.
        alert('Instagram sharing typically requires the app.');
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentArticle?.title,
          text: currentArticle?.description,
          url: window.location.href,
        });
      } else {
        alert('Web Share API is not supported in this browser.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareFacebook = () => {
    shareOnSocialMedia('facebook');
  };

  const handleShareInstagram = () => {
    shareOnSocialMedia('instagram');
  };

  return {
    currentArticle,
    loading,
    showFullContent,
    comments,
    handleLoadMore,
    handleShare,
    handleShareFacebook,
    handleShareInstagram,
    handleCommentAdded,
    handleCommentUpdated,
    handleCommentDeleted,
    isAuthenticated,
    user,
  };
}; 