import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';
import { commentApi } from '../../../services/commentApi';
import type { Comment } from '../../../types/comment';
import CommentComponent from './Comment';
import Spinner from '../../../components/ui/spinner';

interface CommentSectionProps {
  articleId: number;
  isAuthenticated: boolean;
  currentUserId?: number;
  commentsCurrent: Comment[];
  onCommentAdded: (newComment: Comment) => void;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
}

export default function CommentSection({
  articleId,
  isAuthenticated,
  currentUserId,
  commentsCurrent,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    // No need to fetch comments locally, they are passed as commentsCurrent
    // However, if CommentSection was designed to fetch its own comments,
    // this useEffect would handle it.
    // Since comments are now passed as prop, we directly use commentsCurrent
    // and rely on parent to update it via callbacks.

    // If there's an initial load or refresh that needs to be reflected,
    // ensure commentsCurrent is stable or handled by parent.

    // No longer setting comments state directly from commentsCurrent here
    // setComments(commentsCurrent)
  }, [commentsCurrent])

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const response = await commentApi.createComment({
        content: newComment,
        article: articleId
      });
      // Pass the new comment data up to the parent component
      onCommentAdded(response.data);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingComments) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 flex justify-center items-center h-48">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Comments ({commentsCurrent.length})
      </h3>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4 min-h-[100px] resize-none border-gray-200 focus:border-purple-500"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 mr-2">
                  <Spinner />
                </div>
              ) : (
                <Send size={20} className="mr-2" />
              )}
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-purple-50 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-700 mb-4">Join the discussion!</p>
          <a 
            href="/login" 
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Login to Comment
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {commentsCurrent.map((comment, i) => (
          <CommentComponent
            key={comment.id || `comment-${i}`}
            comment={comment}
            isAuthenticated={isAuthenticated}
            currentUserId={currentUserId}
            onCommentUpdate={onCommentUpdated}
            onCommentDelete={onCommentDeleted}
          />
        ))}
        {commentsCurrent.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
} 