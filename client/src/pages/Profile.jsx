/**
 * @file client/src/pages/Profile.jsx
 * @description User profile page with tabs for Personal Info, Change Password, and My Orders.
 * Fetches user data from /api/auth/me, updates via /api/auth/profile.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSave,
  FaSpinner, FaBox, FaEdit, FaCamera, FaShieldAlt, FaCheckCircle,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const TABS = [
  { id: 'profile', label: 'Personal Info', icon: FaUser },
  { id: 'password', label: 'Change Password', icon: FaLock },
  { id: 'orders', label: 'My Orders', icon: FaBox },
];

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '', profilePhoto: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch orders when tab changes to orders
  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const u = res.data.user;
        setProfile({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          profilePhoto: u.profilePhoto || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfileMsg({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get('/orders/my');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name is required.' });
      return;
    }

    try {
      setSaving(true);
      setProfileMsg({ type: '', text: '' });
      const res = await api.put('/auth/profile', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        profilePhoto: profile.profilePhoto,
      });

      if (res.data.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        // Update localStorage user data
        const storedUser = localStorage.getItem('gkcart_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.name = res.data.user.name;
          localStorage.setItem('gkcart_user', JSON.stringify(parsed));
        }
      }
    } catch (error) {
      setProfileMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (!passwords.currentPassword || !passwords.newPassword) {
      setPwdMsg({ type: 'error', text: 'Both fields are required.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setPwdSaving(true);
      const res = await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (res.data.success) {
        setPwdMsg({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPwdMsg({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPwdSaving(false);
    }
  };

  const getInitials = () => {
    if (!profile.name) return '?';
    return profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Processing: 'bg-blue-100 text-blue-700',
    Confirmed: 'bg-cyan-100 text-cyan-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  if (profileLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                                flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                 bg-emerald-50 text-emerald-600 text-xs font-medium">
                  <FaCheckCircle className="text-[10px]" /> Verified
                </span>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                               bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition-colors">
                    <FaShieldAlt className="text-[10px]" /> Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                           transition-all duration-200
                           ${activeTab === tab.id
                             ? 'bg-indigo-600 text-white shadow-md'
                             : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                           }`}
              >
                <Icon className="text-xs" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* === PROFILE TAB === */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>

              {profileMsg.text && (
                <div className={`p-3.5 rounded-xl text-sm ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {profileMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <FaUser className="inline mr-1.5 text-xs text-gray-400" /> Full Name
                  </label>
                  <input type="text" value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <FaEnvelope className="inline mr-1.5 text-xs text-gray-400" /> Email
                  </label>
                  <input type="email" value={profile.email} disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <FaPhone className="inline mr-1.5 text-xs text-gray-400" /> Phone
                  </label>
                  <input type="tel" value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                               placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FaMapMarkerAlt className="inline mr-1.5 text-xs text-gray-400" /> Address
                </label>
                <textarea value={profile.address}
                  onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  placeholder="Enter your delivery address"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                             placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                             text-white rounded-xl font-medium transition-all duration-200
                             disabled:opacity-50 shadow-lg shadow-indigo-200">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* === PASSWORD TAB === */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>

              {pwdMsg.text && (
                <div className={`p-3.5 rounded-xl text-sm ${
                  pwdMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {pwdMsg.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input type="password" value={passwords.currentPassword}
                  onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                             placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={passwords.newPassword}
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                             placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input type="password" value={passwords.confirmPassword}
                  onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900
                             placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>

              <button type="submit" disabled={pwdSaving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                           text-white rounded-xl font-medium transition-all duration-200
                           disabled:opacity-50 shadow-lg shadow-indigo-200">
                {pwdSaving ? <FaSpinner className="animate-spin" /> : <FaLock />}
                {pwdSaving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* === ORDERS TAB === */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>

              {ordersLoading ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin text-indigo-500 text-2xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl
                                 bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-indigo-600 font-mono text-sm font-medium">{order.orderId}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs">
                          {order.products?.length || 0} item(s) •{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-gray-900 font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                        <p className="text-gray-400 text-xs">{order.paymentMethod} • {order.paymentStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBox className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here!</p>
                  <Link to="/products" className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
