import React from 'react';
import { User } from 'lucide-react';
import { formatDate } from 'date-fns';
import type { Article } from '../../../types/article';

interface ArticleContentProps {
  article: Article;
  showFullContent: boolean;
  onLoadMore: () => void;
}

export default function ArticleContent({ article, showFullContent, onLoadMore }: ArticleContentProps) {
  return (
    <div className="p-8">
      <div className="prose max-w-none">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Written by</p>
            <p className="font-semibold text-gray-900">{article.user?.username || 'Anonymous'}</p>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
            <p className="text-sm text-gray-500">Published</p>
            <p className="font-semibold text-gray-900">{formatDate(article.publishedAt, 'dd MMMM yyyy')}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

        <div className="text-gray-700 leading-relaxed text-lg space-y-4">
          {showFullContent
            ? article.description
            : `${article.description?.slice(0, 500)}...`}
        </div>

        {!showFullContent && article.description && article.description.length > 500 && (
          <button
            onClick={onLoadMore}
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
  );
} 