/**
 * @file client/src/pages/Admin/ManageOrders.jsx
 * @description Admin order management page with status updates, filters, and search.
 */

import { useState, useEffect, useCallback } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import DataTable from '../../components/Admin/DataTable';

const STATUS_OPTIONS = ['All', 'Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors = {
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Confirmed: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/admin/orders', { params });
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      header: 'Order ID',
      render: (row) => (
        <span className="text-admin-accent font-mono text-sm font-medium">{row.orderId}</span>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="text-white text-sm">{row.userId?.name || 'Unknown'}</p>
          <p className="text-slate-500 text-xs">{row.userId?.email || ''}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      render: (row) => (
        <span className="text-slate-300 text-sm">{row.products?.length || 0} items</span>
      ),
    },
    {
      header: 'Amount',
      render: (row) => (
        <span className="text-white font-semibold">₹{row.totalAmount?.toLocaleString('en-IN')}</span>
      ),
    },
    {
      header: 'Payment',
      render: (row) => (
        <div>
          <span className="text-slate-300 text-xs">{row.paymentMethod}</span>
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
            row.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
            row.paymentStatus === 'Failed' ? 'bg-red-500/10 text-red-400' :
            'bg-yellow-500/10 text-yellow-400'
          }`}>
            {row.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          disabled={updatingId === row._id}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-admin-accent/30 ${
            statusColors[row.status] || 'text-slate-300 border-white/10'
          } ${updatingId === row._id ? 'opacity-50' : ''}`}
        >
          {STATUS_OPTIONS.filter(s => s !== 'All').map((status) => (
            <option key={status} value={status} className="bg-admin-card text-white">
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Date',
      render: (row) => (
        <span className="text-slate-400 text-xs">
          {new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl font-bold">Orders</h2>
        <p className="text-slate-500 text-sm">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-admin-card/80 rounded-xl px-4 border border-white/5 focus-within:border-admin-accent/30 transition-colors">
          <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order ID..."
            className="w-full bg-transparent px-3 py-3 text-white placeholder-slate-500 text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-admin-card/80 border border-white/5 text-slate-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-admin-accent/30"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyTitle="No orders found"
        emptyMessage="Try adjusting your filters."
      />
    </div>
  );
}

export default ManageOrders;
