import { useState } from 'react';
import { createOrder } from '../services/api';

const AddOrderForm = () => {
  const [form, setForm] = useState({ customer_name: '', product_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customer_name.trim() || !form.product_name.trim()) {
      return setError('Dono fields bharo');
    }
    try {
      setLoading(true);
      await createOrder(form);
      setForm({ customer_name: '', product_name: '' });
    } catch (err) {
      setError('Order create nahi hua — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
    >
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Nayi Order Daalo
      </h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="customer_name"
          value={form.customer_name}
          onChange={handleChange}
          placeholder="Customer name"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          placeholder="Product name"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Adding...' : 'Add Order'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}
    </form>
  );
};

export default AddOrderForm;
