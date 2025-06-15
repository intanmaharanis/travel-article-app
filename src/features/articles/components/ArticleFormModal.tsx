import React, { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { useCategoryStore } from '../../../stores/categoryStore';
import type { Article } from '../../../types/article';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Loader2Icon } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  cover_image_url: z.string().url({ message: "Invalid URL" }).min(1, { message: "Cover image URL is required" }),
  category: z.number().min(1, { message: "Category is required" }),
});

export type ArticleFormValues = z.infer<typeof formSchema>;

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingArticle?: Article | null;
  onSubmit: (data: ArticleFormValues) => void;
  isSubmitting: boolean;
  loading: boolean;
}

export default function ArticleFormModal({
  isOpen,
  onClose,
  editingArticle,
  onSubmit,
  isSubmitting,
  loading,
}: ArticleFormModalProps) {
  const { categories, fetchAllData } = useCategoryStore();

  const { handleSubmit, reset, control, register, formState: { errors } } = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (isOpen) {
      if (categories.length > 0) {
        if (editingArticle) {
          reset({
            title: editingArticle.title,
            description: editingArticle.description,
            cover_image_url: editingArticle.cover_image_url,
            category: editingArticle.category.id,
          });
        } else {
          reset({
            title: '',
            description: '',
            cover_image_url: '',
            category: undefined,
          });
        }
      }
    } else {
      reset();
    }
  }, [isOpen, editingArticle, reset, categories]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editingArticle ? 'Edit Article' : 'Create Article'}</DialogTitle>
          <DialogDescription>
            {editingArticle ? 'Make changes to your article here.' : 'Fill in the details to create a new article.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Input type="text" id="title" {...register('title')} className="mt-1 block w-full" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea id="description" {...register('description')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></Textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
            <Input type="text" id="cover_image_url" {...register('cover_image_url')} className="mt-1 block w-full" />
            {errors.cover_image_url && <p className="text-red-500 text-xs mt-1">{errors.cover_image_url.message}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => {
                const currentCategory = categories.find(cat => cat.id === field.value);
                const placeholderText = currentCategory ? currentCategory.name : "Select a category";
                return (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value ? field.value.toString() : ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={placeholderText} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
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
                editingArticle ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 