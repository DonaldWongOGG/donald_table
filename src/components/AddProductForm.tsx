import { useState, FormEvent } from 'react';
import type { ProductCreate } from '@/types/product';
import type { FormFieldsConfig } from '@/components/FormFields';
import { FormFields } from '@/components/FormFields';
import { SUCCESS_MESSAGE_MS } from '@/constants';
import styles from '@/components/AddProductForm.module.scss';

/** Props for the add-product form. onSubmit is called with the new product (mock: no API). */
interface AddProductFormProps {
  onSubmit: (product: ProductCreate) => void;
}

const defaultValues: ProductCreate = {
  title: '',
  description: '',
  category: '',
  price: 0,
  rating: 0,
  stock: 0,
  brand: '',
};

const formFields: FormFieldsConfig = [
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    required: true,
    requiredText: 'Title is required',
    className: '',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'textarea',
    className: '',
  },
  [
    { label: 'Category', name: 'category', type: 'text', className: 'add-product-form__category' },
    { label: 'Price', name: 'price', type: 'number', min: 0, step: 0.01, className: 'add-product-form__price' },
    { label: 'Rating', name: 'rating', type: 'number', min: 0, max: 5, step: 0.1, className: 'add-product-form__rating' },
    { label: 'Stock', name: 'stock', type: 'number', min: 0, className: 'add-product-form__stock' },
    { label: 'Brand', name: 'brand', type: 'text', className: 'add-product-form__brand' },
  ],
];

export function AddProductForm({ onSubmit }: AddProductFormProps) {
  const [form, setForm] = useState<ProductCreate>(defaultValues);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(defaultValues);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      rating: Number(form.rating) || 0,
      stock: Number(form.stock) || 0,
      brand: form.brand?.trim() || undefined,
    });
    resetForm();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), SUCCESS_MESSAGE_MS);
  };

  return (
    <section className={styles['add-product-form']}>
      <h2 className={styles['add-product-form__title']}>Add product (mock)</h2>
      <form onSubmit={handleSubmit} className={styles['add-product-form__form']}>
        <FormFields
          fields={formFields}
          values={form}
          onChange={handleChange}
          getClass={(className) => (className ? (styles[className] as string) : '')}
        />
        <div className={styles['add-product-form__actions']}>
          <button type="submit">Add product</button>
          {submitted && (
            <span className={styles['add-product-form__success']}>Product added to list.</span>
          )}
        </div>
      </form>
    </section>
  );
}
