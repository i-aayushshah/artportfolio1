import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { PhotoIcon, UserGroupIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    artworks: 0,
    subscribers: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const [artworksRes, subscribersRes] = await Promise.all([
        fetch('/api/admin/artworks', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/subscribers', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const artworksData = await artworksRes.json();
      const subscribersData = await subscribersRes.json();

      setStats({
        artworks: artworksData.success ? artworksData.data.length : 0,
        subscribers: subscribersData.success ? subscribersData.count : 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      name: 'Total Artworks',
      value: stats.artworks,
      icon: PhotoIcon,
      color: 'bg-blue-500',
      href: '/admin/artworks',
    },
    {
      name: 'Subscribers',
      value: stats.subscribers,
      icon: UserGroupIcon,
      color: 'bg-green-500',
      href: '/admin/subscribers',
    },
    {
      name: 'Content Sections',
      value: 3,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      href: '/admin/content',
    },
  ];

  const quickActions = [
    {
      name: 'Add New Artwork',
      description: 'Upload and add a new artwork to your portfolio',
      href: '/admin/artworks?action=add',
      icon: PhotoIcon,
      color: 'bg-amber-500',
    },
    {
      name: 'Edit Hero Section',
      description: 'Update your homepage hero content',
      href: '/admin/content?section=hero',
      icon: DocumentTextIcon,
      color: 'bg-emerald-500',
    },
    {
      name: 'View Subscribers',
      description: 'Manage your newsletter subscribers',
      href: '/admin/subscribers',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'View Portfolio',
      description: 'See how your portfolio looks to visitors',
      href: '/',
      icon: EyeIcon,
      color: 'bg-gray-500',
      external: true,
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${card.color} rounded-md p-3`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.loading ? (
                            <div className="animate-pulse h-6 bg-gray-200 rounded w-12"></div>
                          ) : (
                            card.value
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href={card.href} className="font-medium text-amber-700 hover:text-amber-900">
                    View all
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <div
                  key={action.name}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <span className={`${action.color} rounded-lg inline-flex p-3 ring-4 ring-white`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <a
                        href={action.href}
                        className="focus:outline-none"
                        target={action.external ? '_blank' : undefined}
                        rel={action.external ? 'noopener noreferrer' : undefined}
                      >
                        <span className="absolute inset-0" />
                        {action.name}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                  </div>
                  <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Welcome to Your Admin Dashboard</h3>
            <div className="prose prose-sm text-gray-500">
              <p>
                Welcome to your art portfolio admin dashboard! Here you can manage all aspects of your portfolio:
              </p>
              <ul className="mt-4 space-y-2">
                <li>• <strong>Manage Artworks:</strong> Add, edit, or delete artworks from your portfolio</li>
                <li>• <strong>Edit Content:</strong> Update your hero section, about page, and footer</li>
                <li>• <strong>View Subscribers:</strong> See who's subscribed to your newsletter</li>
                <li>• <strong>Settings:</strong> Update your admin profile and password</li>
              </ul>
              <p className="mt-4">
                When you add new artworks, all your subscribers will automatically receive an email notification!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
