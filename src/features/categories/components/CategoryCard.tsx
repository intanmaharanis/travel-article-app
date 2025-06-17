import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Category } from '../../../types/category';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import ConfirmDeleteDialog from '../../../components/ConfirmDeleteDialog';

interface CategoryCardProps {
  category: Category;
  Icon: LucideIcon;
  isAuthenticated: boolean;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, Icon, onEdit, onDelete, isAuthenticated }) => {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  return (
    <div className="flex flex-col items-start p-6 rounded-xl bg-teal-900 text-white shadow-lg relative transform transition-transform duration-300 hover:scale-105">
      <div className="mb-4">
        <Icon size={48} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
      <p className="text-sm text-gray-300 mb-4 text-justify">{category.description}</p>

       
        {isAuthenticated && onEdit && (
        <div className="absolute top-4 right-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:text-gray-800">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1 bg-white shadow-lg rounded-md">
              <div className="grid gap-1">
                
                  <button
                    onClick={() => onEdit(category)}
                    className="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
              
              
                  <button
                    onClick={() => {
                      setShowConfirmDelete(true);
                    }}
                    className="flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
              
              </div>
            </PopoverContent>
          </Popover>
        </div>)}
      
      {onDelete && (
        <ConfirmDeleteDialog
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={() => {
            onDelete(category.documentId);
            setShowConfirmDelete(false);
          } }
          title="Are you absolutely sure?"
          description={`This action cannot be undone. This will permanently delete the category "${category.name}" and remove its data from our servers.`} itemType={''} itemName={''}        />
      )}
    </div>
  );
};

export default CategoryCard; 