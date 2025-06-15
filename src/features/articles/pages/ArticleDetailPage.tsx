import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useArticleStore } from '../../../stores/articleStore';
import { useAuth } from '../../../hooks/useAuth';
import CommentSection from '../components/CommentSection';
import type { Comment } from '../../../types/comment';
import UserSocialShare from '../../../components/UserSocialShare';
import ArticleContent from '../components/ArticleContent';

export default function ArticleDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();
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

  const handleShare = async () => {
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentArticle?.title,
          text: currentArticle?.description,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('Web Share API is not supported in this browser.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      
    }
  };

  const handleShareFacebook = () => {
    shareOnSocialMedia('facebook');
  };

  const handleShareInstagram = () => {
    shareOnSocialMedia('instagram');
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading || !currentArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="w-full md:max-w-10/12 mx-auto">
          {/* Skeleton for Hero Image */}
          <div className="relative mb-12 h-[600px] w-full bg-gray-200 rounded-2xl animate-pulse"></div>

          {/* Skeleton for Article Content */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Skeleton for User Social Share */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div className="h-6 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="flex space-x-4 mt-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Skeleton for Comment Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 ">
      <div className="w-full md:max-w-10/12 mx-auto px-4 mt-10">
        {/* Article Header with Hero Image */}
        <div className="relative mb-12">
          {currentArticle.cover_image_url && (
            <div className="relative h-[600px] w-full bg-cover bg-center overflow-hidden rounded-2xl">
              <img
                src={currentArticle.cover_image_url}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
            </div>
          )}
        </div>

        <ArticleContent article={currentArticle} showFullContent={showFullContent} onLoadMore={handleLoadMore}/>

        <UserSocialShare
          username={currentArticle.user?.username || 'Anonymous'}
          description={currentArticle.description}
          onShareClick={handleShare}
          onShareFacebook={handleShareFacebook}
          onShareInstagram={handleShareInstagram}
        />

        {/* Comment Section */}
        {documentId && (currentArticle?.id !== undefined) && (
          <CommentSection
            articleId={currentArticle.id}
            isAuthenticated={isAuthenticated}
            currentUserId={user?.id}
            commentsCurrent={comments}
            onCommentAdded={handleCommentAdded}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        )}
      </div>
    </div>
  );
} 