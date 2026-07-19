import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  ImagePlus,
} from 'lucide-react';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProductsAdmin,
  type ProductInput,
  type ProductRow,
} from '../../lib/products';
import { supabase } from '../../lib/supabase';
import { categories } from '../../data/store';

const badges = ['', 'New', 'Best Seller', 'Trending', 'Limited'];

type FormState = {
  name: string;
  category: string;
  price: string;
  old_price: string;
  rating: string;
  reviews: string;
  badge: string;
  discount: string;
  image: string;
  hover_image: string;
  description: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  name: '',
  category: categories[0].name,
  price: '',
  old_price: '',
  rating: '5',
  reviews: '0',
  badge: 'New',
  discount: '',
  image: '',
  hover_image: '',
  description: '',
  is_active: true,
};

function toForm(p: ProductRow): FormState {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    old_price: p.old_price ? String(p.old_price) : '',
    rating: String(p.rating),
    reviews: String(p.reviews),
    badge: p.badge ?? '',
    discount: p.discount ? String(p.discount) : '',
    image: p.image,
    hover_image: p.hover_image ?? '',
    description: p.description ?? '',
    is_active: p.is_active,
  };
}

function toInput(f: FormState): ProductInput {
  return {
    name: f.name.trim(),
    category: f.category,
    price: parseFloat(f.price) || 0,
    old_price: f.old_price ? parseFloat(f.old_price) : null,
    rating: parseFloat(f.rating) || 5,
    reviews: parseInt(f.reviews, 10) || 0,
    badge: f.badge || null,
    discount: f.discount ? parseInt(f.discount, 10) : null,
    image: f.image.trim(),
    hover_image: f.hover_image.trim() || null,
    description: f.description.trim() || null,
    is_active: f.is_active,
  };
}

export default function ProductForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(mode === 'create');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);

  // Load existing product in edit mode
  if (mode === 'edit' && !loaded) {
    fetchAllProductsAdmin()
      .then((rows) => {
        const found = rows.find((r) => r.id === parseInt(id ?? '0', 10));
        if (found) setForm(toForm(found));
        else setError('Product not found.');
        setLoaded(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load product.');
        setLoaded(true);
      });
  }

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const uploadImage = async (file: File, field: 'image' | 'hover_image') => {
    const setUploading = field === 'image' ? setUploadingImage : setUploadingHover;
    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      update(field, data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed.'
      );
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price) e.price = 'Price is required';
    else if (parseFloat(form.price) < 0) e.price = 'Price must be positive';
    if (!form.image.trim()) e.image = 'Image is required';
    else if (!/^https?:\/\//.test(form.image.trim()))
      e.image = 'Upload an image or enter a valid http(s) URL';
    if (form.old_price && parseFloat(form.old_price) <= parseFloat(form.price))
      e.old_price = 'Old price should be higher than price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSaving(true);
    try {
      const input = toInput(form);
      if (mode === 'create') {
        await createProduct(input);
        navigate('/admin/products');
      } else {
        await updateProduct(parseInt(id ?? '0', 10), input);
        navigate('/admin/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit') return;
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteProduct(parseInt(id ?? '0', 10));
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
      setDeleting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-mint-dark" />
      </div>
    );
  }

  const inputClass = (field: keyof FormState) =>
    `w-full rounded-2xl border bg-white px-4 py-3 font-body text-sm text-ink outline-none transition focus:border-mint-dark ${
      errors[field] ? 'border-red-400' : 'border-mint/30'
    }`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 font-btn text-[11px] uppercase tracking-[0.16em] text-ink/55 transition hover:text-mint-dark"
      >
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </h1>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 font-btn text-[11px] font-semibold uppercase tracking-[0.14em] text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {/* Image preview + upload */}
        <div className="sm:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_1fr]">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-fog shadow-soft">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="grid h-full place-items-center font-body text-xs text-ink/40">
                  Image preview
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                  Primary Image *
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-mint/30 bg-white px-4 py-3 font-body text-sm text-ink transition hover:border-mint-dark">
                  <ImagePlus size={16} />
                  {uploadingImage ? 'Uploading…' : 'Choose image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, 'image');
                    }}
                  />
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => update('image', e.target.value)}
                  className={`${inputClass('image')} mt-2`}
                  placeholder="or paste an image URL"
                />
                {errors.image && (
                  <p className="mt-1 font-body text-xs text-red-500">{errors.image}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
                  Hover Image <span className="text-ink/35">(optional)</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-mint/30 bg-white px-4 py-3 font-body text-sm text-ink transition hover:border-mint-dark">
                  <ImagePlus size={16} />
                  {uploadingHover ? 'Uploading…' : 'Choose image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingHover}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file, 'hover_image');
                    }}
                  />
                </label>
                <input
                  type="url"
                  value={form.hover_image}
                  onChange={(e) => update('hover_image', e.target.value)}
                  className={`${inputClass('hover_image')} mt-2`}
                  placeholder="or paste an image URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Product Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass('name')}
            placeholder="e.g. Seraphina Stiletto"
          />
          {errors.name && (
            <p className="mt-1 font-body text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={`${inputClass('category')} appearance-none`}
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Badge
          </label>
          <select
            value={form.badge}
            onChange={(e) => update('badge', e.target.value)}
            className={`${inputClass('badge')} appearance-none`}
          >
            {badges.map((b) => (
              <option key={b} value={b}>
                {b || 'None'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Price (GHS) *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            className={inputClass('price')}
            placeholder="480"
          />
          {errors.price && (
            <p className="mt-1 font-body text-xs text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Old Price <span className="text-ink/35">(for discounts)</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.old_price}
            onChange={(e) => update('old_price', e.target.value)}
            className={inputClass('old_price')}
            placeholder="620"
          />
          {errors.old_price && (
            <p className="mt-1 font-body text-xs text-red-500">{errors.old_price}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Discount % <span className="text-ink/35">(optional)</span>
          </label>
          <input
            type="number"
            min="0"
            max="90"
            value={form.discount}
            onChange={(e) => update('discount', e.target.value)}
            className={inputClass('discount')}
            placeholder="20"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Rating (0–5)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={form.rating}
            onChange={(e) => update('rating', e.target.value)}
            className={inputClass('rating')}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Reviews count
          </label>
          <input
            type="number"
            min="0"
            value={form.reviews}
            onChange={(e) => update('reviews', e.target.value)}
            className={inputClass('reviews')}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-btn text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Description <span className="text-ink/35">(optional)</span>
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className={`${inputClass('description')} resize-none`}
            placeholder="Handcrafted from premium materials…"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => update('is_active', e.target.checked)}
              className="h-5 w-5 rounded border-mint/40 text-mint-dark focus:ring-mint-dark"
            />
            <span className="font-body text-sm text-ink">
              Active <span className="text-ink/45">(visible on storefront)</span>
            </span>
          </label>
        </div>

        {error && (
          <div className="sm:col-span-2 flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 font-body text-xs text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={1.8} />
                {mode === 'create' ? 'Create Product' : 'Save Changes'}
              </>
            )}
          </button>
          <Link to="/admin/products" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}