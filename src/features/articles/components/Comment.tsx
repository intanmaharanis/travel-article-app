import React, { useState } from 'react';
import { Edit2, Trash2, X, Check, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import type { Comment as CommentType } from '../../../types/comment';
import { toast } from 'sonner';
import { commentApi } from '../../../services/commentApi';

interface CommentProps {
  comment: CommentType;
  isAuthenticated: boolean;
  currentUserId?: number;
  onCommentUpdate: (updatedComment: CommentType) => void;
  onCommentDelete: (commentId: number) => void;
}

export default function Comment({ 
  comment, 
  isAuthenticated, 
  currentUserId,
  onCommentUpdate,
  onCommentDelete 
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateComment = async () => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await commentApi.updateComment(comment.id, {
        content: editContent
      });
      onCommentUpdate(response.data);
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentApi.deleteComment(comment.id);
      onCommentDelete(comment.id);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const canEdit = isAuthenticated;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[100px] resize-none border-gray-200 focus:border-purple-500"
            placeholder="Edit your comment..."
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-700"
            >
              <X size={20} className="mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdateComment}
              disabled={isSubmitting || !editContent.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={20} className="mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  abc
                </h4>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            {canEdit && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-purple-600 transition p-1.5 rounded-full hover:bg-purple-50"
                  aria-label="Edit comment"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="text-gray-500 hover:text-red-600 transition p-1.5 rounded-full hover:bg-red-50"
                  aria-label="Delete comment"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>
        </>
      )}
    </div>
  );
} 