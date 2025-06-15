import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useArticleStore } from '../../../stores/articleStore';
import {  Loader2Icon } from 'lucide-react';
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
  const [isSharing, setIsSharing] = useState(false);
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
    setIsSharing(true);
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
      setIsSharing(false);
    }
  };

  const handleShareFacebook = () => {
    shareOnSocialMedia('facebook');
  };

  const handleShareInstagram = () => {
    shareOnSocialMedia('instagram');
  };

  const handleShareWhatsapp = () => {
    shareOnSocialMedia('whatsapp');
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticle?.title || '');
    const text = encodeURIComponent(currentArticle?.description || '');

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 ">
      <div className="max-w-10/12 mx-auto px-4 mt-10">
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
          description={''}
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