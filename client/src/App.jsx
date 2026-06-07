import useOrders from './hooks/useOrders';
import AddOrderForm from './components/AddOrderForm';
import OrderTable from './components/OrderTable';
import ConnectionStatus from './components/ConnectionStatus';

const App = () => {
  const { orders, connected, loading } = useOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders — Live Feed
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time updates via WebSocket + MongoDB Change Streams
            </p>
          </div>
          <ConnectionStatus connected={connected} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total',
              value: orders.length,
              color: 'text-gray-800',
            },
            {
              label: 'Pending',
              value: orders.filter((o) => o.status === 'pending').length,
              color: 'text-yellow-600',
            },
            {
              label: 'Delivered',
              value: orders.filter((o) => o.status === 'delivered').length,
              color: 'text-green-600',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
            >
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Add Order Form */}
        <div className="mb-6">
          <AddOrderForm />
        </div>

        {/* Orders Table */}
        <OrderTable orders={orders} loading={loading} />
      </div>
    </div>
  );
};

export default App;
