import React from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Filter, Search } from "lucide-react";
import type { Category } from '../../../types/category';

interface ArticleListControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  showMyArticlesOnly: boolean;
  setShowMyArticlesOnly: (value: boolean) => void;
  categories: Category[];
  isAuthenticated: boolean;
}

const ArticleListControls: React.FC<ArticleListControlsProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  showMyArticlesOnly,
  setShowMyArticlesOnly,
  categories,
  isAuthenticated,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex w-full flex-wrap md:flex-nowrap md:w-auto gap-2">
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <Select onValueChange={(value: string) => setSelectedCategoryId(value === "-1" ? "" : value)} value={selectedCategoryId}>
          <SelectTrigger className="w-full md:w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Categories</SelectItem>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isAuthenticated && (
          <Button
            onClick={() => setShowMyArticlesOnly(!showMyArticlesOnly)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-6 py-2 rounded-md"
          >
            {showMyArticlesOnly ? 'Show All Articles' : 'Show My Articles'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArticleListControls; 