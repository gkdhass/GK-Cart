/**
 * @file client/src/pages/Admin/AddProduct.jsx
 * @description Page for adding a new product via the admin dashboard.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import ProductForm from '../../components/Admin/ProductForm';

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/admin/products', formData);
      if (res.data.success) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-white text-2xl font-bold">Add Product</h2>
          <p className="text-slate-500 text-sm">Create a new product listing</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Product"
      />
    </div>
  );
}

export default AddProduct;
