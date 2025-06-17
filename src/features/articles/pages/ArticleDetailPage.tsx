import { useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import UserSocialShare from '../../../components/UserSocialShare';
import ArticleContent from '../components/ArticleContent';
import ArticleDetailSkeleton from '../components/ArticleDetailSkeleton';
import { useArticleDetailLogic } from '../../../hooks/useArticleDetailLogic';

export default function ArticleDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const {
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
  } = useArticleDetailLogic(documentId);

  if (loading || !currentArticle) {
    return <ArticleDetailSkeleton />;
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