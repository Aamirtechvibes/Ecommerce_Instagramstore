import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';

type Category = Database['public']['Tables']['categories']['Row'];

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  mrp: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  images: z.string(),
  videoUrl: z.string().optional(),
  stockQuantity: z.number().min(0, 'Stock must be positive'),
  isTrending: z.boolean(),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  isTopPick: z.boolean(),
  tags: z.string(),
});

type ProductForm = z.infer<typeof productSchema>;

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stockQuantity: 10,
      isTrending: false,
      isNewArrival: false,
      isBestSeller: false,
      isTopPick: false,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (data) setCategories(data);
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      reset({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: data.price,
        mrp: data.mrp || undefined,
        categoryId: data.category_id || '',
        color: data.color || '',
        material: data.material || '',
        images: data.images.join('\n'),
        videoUrl: data.video_url || '',
        stockQuantity: data.stock_quantity,
        isTrending: data.is_trending,
        isNewArrival: data.is_new_arrival,
        isBestSeller: data.is_best_seller,
        isTopPick: data.is_top_pick,
        tags: data.tags.join(', '),
      });
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      const images = data.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const tags = data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        mrp: data.mrp || null,
        category_id: data.categoryId || null,
        color: data.color || null,
        material: data.material || null,
        images,
        video_url: data.videoUrl || null,
        stock_quantity: data.stockQuantity,
        is_trending: data.isTrending,
        is_new_arrival: data.isNewArrival,
        is_best_seller: data.isBestSeller,
        is_top_pick: data.isTopPick,
        tags,
      };

      if (id) {
        await supabase.from('products').update(productData).eq('id', id);
      } else {
        await supabase.from('products').insert(productData);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-light tracking-wide">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Slug (URL friendly)"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />
            <Input
              label="MRP (₹)"
              type="number"
              step="0.01"
              {...register('mrp', { valueAsNumber: true })}
              error={errors.mrp?.message}
            />
            <select
              {...register('categoryId')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input
              label="Stock Quantity"
              type="number"
              {...register('stockQuantity', { valueAsNumber: true })}
              error={errors.stockQuantity?.message}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Description"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Color"
              {...register('color')}
              error={errors.color?.message}
            />
            <Input
              label="Material"
              {...register('material')}
              error={errors.material?.message}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">Media</h2>
          <div className="space-y-4">
            <Textarea
              label="Image URLs (one per line)"
              rows={6}
              {...register('images')}
              error={errors.images?.message}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
            <Input
              label="Video URL (Instagram Reel)"
              {...register('videoUrl')}
              error={errors.videoUrl?.message}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">Product Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isTrending')} />
              <span>Trending</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isNewArrival')} />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isBestSeller')} />
              <span>Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isTopPick')} />
              <span>Top Pick</span>
            </label>
          </div>

          <div className="mt-4">
            <Input
              label="Tags (comma separated)"
              {...register('tags')}
              error={errors.tags?.message}
              placeholder="sale, limited, premium"
            />
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
