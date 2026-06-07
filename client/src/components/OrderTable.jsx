import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { updateOrderStatus, deleteOrder } from '../services/api';

const STATUSES = ['pending', 'shipped', 'delivered'];

const OrderTable = ({ orders, loading }) => {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatus(id, status);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteOrder(id);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Loading orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Koi order nahi hai abhi — upar se add karo
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            {['Customer', 'Product', 'Status', 'Update', 'Time', ''].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left font-medium"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {order.customer_name}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {order.product_name}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(order.updated_at).toLocaleTimeString()}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(order._id)}
                  disabled={deleting === order._id}
                  className="text-red-400 hover:text-red-600 text-xs disabled:opacity-50 transition-colors"
                >
                  {deleting === order._id ? '...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
