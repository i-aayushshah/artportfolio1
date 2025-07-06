import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { UserGroupIcon, EnvelopeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        fetchSubscribers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Subscribers">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Subscribers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Newsletter Subscribers ({subscribers.length})
            </h2>
            <p className="text-sm text-gray-500">
              Manage your newsletter subscriber list
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {subscribers.length} total subscribers
            </span>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Subscribers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {subscribers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <li key={subscriber._id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-600 to-emerald-600 flex items-center justify-center">
                          <EnvelopeIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Subscribed: {formatDate(subscriber.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <button
                        onClick={() => handleUnsubscribe(subscriber.email)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Unsubscribe user"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No subscribers yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                When visitors subscribe to your newsletter, they'll appear here.
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <EnvelopeIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Automatic Email Notifications
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  When you add new artworks to your portfolio, all active subscribers will automatically receive an email notification with the artwork details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
