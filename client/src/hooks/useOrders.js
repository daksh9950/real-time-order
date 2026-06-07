import { useState, useEffect } from 'react';
import { fetchOrders } from '../services/api';
import socket from '../socket';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('order_update', ({ operation, record }) => {
      setOrders((prev) => {
        if (operation === 'INSERT') return [record, ...prev];
        if (operation === 'UPDATE')
          return prev.map((o) => (o._id === record._id ? record : o));
        if (operation === 'DELETE')
          return prev.filter((o) => o._id !== record._id);
        return prev;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('order_update');
    };
  }, []);

  return { orders, connected, loading };
};

export default useOrders;
