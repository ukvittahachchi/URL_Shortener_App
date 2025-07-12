import { useEffect, useState } from 'react';
import { getUrlStats } from '../services/api';
import { ChartBarIcon, CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

const ClickStats = ({ shortCode }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUrlStats(shortCode);
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [shortCode]);

  if (loading) return <p className="text-gray-500">Loading stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">Total Clicks</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.clicks}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <LinkIcon className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">Short URL</span>
          </div>
          <a
            href={stats.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {stats.shortUrl}
          </a>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">Created</span>
          </div>
          <p className="mt-2">
            {new Date(stats.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClickStats;