import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Image, Video, Star, Clock, ArrowRight, User, MessageCircleMore, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import type { ArticleCardProps } from '../../../types/article';
import { formatDate } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';

export default function ArticlesCard({ article, isAuthenticated, currentUserId, onEdit, onDelete }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isAuthor = isAuthenticated && currentUserId === article.user?.id;

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-100 w-full rounded-t-2xl">
        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className={`p-6 flex flex-col justify-between absolute inset-x-0 z-10 bg-white rounded-xl transition-all duration-300 ease-in-out ${isHovered ? 'min-h-64 bottom-0' : 'min-h-54 -bottom-10'}`}>
        <div className='mb-4'>
        <span className='absolute -top-4 bg-purple-600 text-white text-sm px-3 rounded-full py-1'>{article.category.name}</span>

         <div className='flex text-sm text-grey-500 justify-between'>
                <p>{formatDate(article.publishedAt, 'dd MMMM yyyy')}</p>
                <p>
                {article?.user?.username || ''}
                </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {article.title}
            </h3>
            <p className="line-clamp-2">{article.description}</p>

        </div>


        <div className="min-h-12 flex flex-col justify-between mb-4">
         <div className='flex gap-1 justify-between items-center w-full'>
              <div className='flex gap-1 items-center'>
              <MessageCircleMore width={16} />
              <p className='text-sm text-grey-600'> {article.comments.length} comments</p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1">
                  <div className="grid gap-1">
                    
                    {onEdit && (
                      <button
                        onClick={() => onEdit(article.documentId)}
                        className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(article.documentId)}
                        className="flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
          </div>
          {isHovered && (
            <Link
              to={`/articles/${article.documentId}`}
              className="inline-flex items-center justify-center bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 w-full mt-4"
            >
              More Information <ArrowRight size={20} className="ml-2" />
            </Link> 
          )} 
        </div>
      </div>
    </div>
  );
}
