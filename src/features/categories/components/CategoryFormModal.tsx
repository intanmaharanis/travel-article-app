import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Loader2Icon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: { id: number; name: string; description: string } | null;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
  loading: boolean;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
  isSubmitting,
  loading,
}: CategoryFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        reset({ name: editingCategory.name, description: editingCategory.description });
      } else {
        reset({ name: '', description: '' });
      }
    }
  }, [isOpen, editingCategory, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Make changes to your category here.' : 'Fill in the details to create a new category.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input type="text" id="name" {...register('name')} className="mt-2 block w-full" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Input type="text" id="description" {...register('description')} className="mt-2 block w-full" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading} className="bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50">
              {(isSubmitting || loading) ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                editingCategory ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 