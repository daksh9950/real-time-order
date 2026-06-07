const colors = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;
