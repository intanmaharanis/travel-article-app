import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '../types/category';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { useAuthStore } from '../stores/authStore';

interface CategoryCardProps {
  category: Category;
  Icon: LucideIcon;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, Icon, onEdit, onDelete }) => {
  const { isAuthenticated, user } = useAuthStore();
  // Assuming user with roleId 1 is admin, adjust as per your backend roles
  const isAdmin = isAuthenticated && user?.role.id === 1;

  return (
    <div className="flex flex-col items-start p-6 rounded-xl bg-teal-900 text-white shadow-lg relative">
      <div className="mb-4">
        <Icon size={48} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>

       
        <div className="absolute top-4 right-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:text-gray-200">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1 bg-white shadow-lg rounded-md">
              <div className="grid gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(category)}
                    className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(category.id)}
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
      
    </div>
  );
};

export default CategoryCard; 