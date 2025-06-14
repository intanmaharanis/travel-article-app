import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticleStore } from '../../../stores/articleStore';
import Spinner from '../../../components/ui/spinner';
import { Facebook, Twitter, Linkedin, Share2, User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import CommentSection from '../components/CommentSection';
import { formatDate } from 'date-fns';
import type { Article } from '../../../types/article';
import type { Comment } from '../../../types/comment';
import ArticleDetailSkeleton from '../components/ArticleDetailSkeleton';

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
      comment.id === updatedComment.id ? updatedComment : comment
    ));
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
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
    return <ArticleDetailSkeleton />;
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

        <div className="lg:col-span-2  rounded-2xl p-8">
            <div className="prose max-w-none">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Written by</p>
                  <p className="font-semibold text-gray-900">{currentArticle.user?.username || 'Anonymous'}</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-semibold text-gray-900">{formatDate(currentArticle.publishedAt, 'dd MMMM yyyy')}</p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {currentArticle.title}
              </h1>

              <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                {showFullContent
                  ? currentArticle.description
                  : `${currentArticle.description?.slice(0, 500)}...`}
              </div>

              {!showFullContent && currentArticle.description && currentArticle.description.length > 500 && (
                <button
                  onClick={handleLoadMore}
                  className="mt-6 text-purple-600 font-semibold hover:text-purple-700 transition flex items-center group"
                >
                  Read More
                  <svg 
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

        {/* Social Sharing */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => shareOnSocialMedia('facebook')}
                className="text-blue-600 hover:text-blue-700 transition p-2 hover:bg-blue-50 rounded-full"
                aria-label="Share on Facebook"
              >
                <Facebook size={24} />
              </button>
              <button
                onClick={() => shareOnSocialMedia('twitter')}
                className="text-blue-400 hover:text-blue-500 transition p-2 hover:bg-blue-50 rounded-full"
                aria-label="Share on Twitter"
              >
                <Twitter size={24} />
              </button>
              <button
                onClick={() => shareOnSocialMedia('linkedin')}
                className="text-blue-700 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded-full"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={24} />
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="text-gray-600 hover:text-gray-700 transition p-2 hover:bg-gray-50 rounded-full"
                aria-label="Share using native share"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>

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