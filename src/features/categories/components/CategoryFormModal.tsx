import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import Spinner from '../../../components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';

const formSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: { id: number; name: string } | null;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  editingCategory,
  onSubmit,
  isSubmitting,
}: CategoryFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        reset({ name: editingCategory.name });
      } else {
        reset();
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <Input type="text" id="name" {...register('name')} className="mt-2 block w-full" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50">
              {isSubmitting ? (
                <div className="w-5 h-5 mr-2"><Spinner /></div>
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