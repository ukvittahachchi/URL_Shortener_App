import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { getUserUrls, shortenUrl } from '../services/api';
import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Dashboard = () => {
  const [state, setState] = useState({
    user: null,
    urls: [],
    loading: true,
    error: null,
    searchTerm: '',
    newUrl: '',
    isShortening: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  });

  const navigate = useNavigate();

  const filteredUrls = (state.urls || []).filter(url => {
    const search = state.searchTerm.toLowerCase();
    return (
      (url?.originalUrl?.toLowerCase()?.includes(search) || false) ||
      (url?.shortCode?.toLowerCase()?.includes(search) || false)
    );
  });

  const totalPages = Math.ceil(filteredUrls.length / state.pagination.limit);
  const paginatedUrls = filteredUrls.slice(
    (state.pagination.page - 1) * state.pagination.limit,
    state.pagination.page * state.pagination.limit
  );

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        updateState({ loading: true, error: null });
        
        const [userData, userUrls] = await Promise.all([
          getCurrentUser(),
          getUserUrls({ signal: abortController.signal })
        ]);

        if (!isMounted) return;

        if (!userData) {
          navigate('/login');
          return;
        }

        updateState({
          user: userData,
          urls: Array.isArray(userUrls) ? userUrls : [],
          pagination: {
            ...state.pagination,
            total: Array.isArray(userUrls) ? userUrls.length : 0
          },
          loading: false
        });
      } catch (err) {
        if (!isMounted || err.name === 'AbortError') return;
        
        const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
        updateState({ error: errorMessage, loading: false });
        
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        navigate('/login');
      } catch (err) {
        updateState({ 
          error: err.response?.data?.message || 'Logout failed' 
        });
      }
    }
  };

  const handleRefresh = async () => {
    updateState({ loading: true });
    try {
      const userUrls = await getUserUrls();
      updateState({
        urls: Array.isArray(userUrls) ? userUrls : [],
        pagination: {
          ...state.pagination,
          total: Array.isArray(userUrls) ? userUrls.length : 0,
          page: 1
        },
        loading: false,
        error: null
      });
    } catch (err) {
      updateState({ 
        error: err.response?.data?.message || 'Refresh failed',
        loading: false
      });
    }
  };

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!state.newUrl.trim()) {
      updateState({ error: 'Please enter a valid URL' });
      return;
    }

    updateState({ isShortening: true, error: null });
    
    try {
      const shortenedUrl = await shortenUrl(state.newUrl);
      updateState(prev => ({
        urls: [shortenedUrl, ...prev.urls],
        newUrl: '',
        pagination: {
          ...prev.pagination,
          total: prev.urls.length + 1,
          page: 1
        },
        isShortening: false
      }));
    } catch (err) {
      updateState({ 
        error: err.response?.data?.message || 'Failed to shorten URL',
        isShortening: false
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateState({
      pagination: {
        ...state.pagination,
        page: newPage
      }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a temporary "Copied!" notification here
    } catch (err) {
      updateState({ error: 'Failed to copy to clipboard' });
    }
  };

  if (state.loading && !state.urls.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-500">
          Unable to load user data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 bg-fixed"
      style={{
        backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover,bg-cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay'
        
      }}
    >
      {/* Fixed Navbar */}
      <nav className="bg-indigo-600 shadow-lg fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">URL Shortener</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-full text-white hover:bg-indigo-700 transition-colors"
                aria-label="Refresh data"
                disabled={state.loading}
              >
                <ArrowPathIcon className={`h-5 w-5 ${state.loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Added padding-top to account for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24">
        {/* Error Display */}
        {state.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center shadow-sm">
            <span>{state.error}</span>
            <button 
              onClick={() => updateState({ error: null })} 
              className="text-red-700 hover:text-red-900"
              aria-label="Dismiss error"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* User Welcome Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-8 transition-all hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back, {state.user.email || 'User'}!
              </h2>
              <p className="text-gray-600 mt-1">
                You have {state.urls.length} shortened {state.urls.length === 1 ? 'URL' : 'URLs'}.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* URL Shortener Form */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-8 transition-all hover:shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Shorten New URL</h3>
          <form onSubmit={handleShortenUrl} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="url"
                placeholder="Enter URL to shorten (e.g., https://example.com)"
                value={state.newUrl}
                onChange={(e) => updateState({ newUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-70"
              disabled={state.isShortening}
            >
              {state.isShortening ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
              Shorten URL
            </button>
          </form>
        </div>

        {/* URL List Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white bg-opacity-50">
            <h3 className="text-xl font-bold text-gray-800">Your Shortened URLs</h3>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search URLs..."
                value={state.searchTerm}
                onChange={(e) => {
                  updateState({ 
                    searchTerm: e.target.value,
                    pagination: { ...state.pagination, page: 1 }
                  });
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full transition-all"
                aria-label="Search URLs"
              />
            </div>
          </div>

          {filteredUrls.length === 0 ? (
            <div className="px-6 py-12 text-center bg-white bg-opacity-50">
              <p className="text-gray-500 text-lg">
                {state.searchTerm ? "No matching URLs found." : "You haven't shortened any URLs yet."}
              </p>
              {!state.searchTerm && (
                <button
                  onClick={() => document.querySelector('input[type="url"]')?.focus()}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Shorten your first URL
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 bg-opacity-70">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Short URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white bg-opacity-70 divide-y divide-gray-200">
                    {paginatedUrls.map((url) => (
                      <tr key={url._id || Math.random()} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={url.shortUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                            >
                              {url.shortUrl || 'Invalid URL'}
                            </a>
                            <button 
                              onClick={() => copyToClipboard(url.shortUrl)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors"
                              aria-label="Copy to clipboard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <a
                            href={url.originalUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 hover:underline"
                            title={url.originalUrl}
                          >
                            {url.originalUrl || 'N/A'}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {url.clicks || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {url.createdAt ? format(new Date(url.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredUrls.length > state.pagination.limit && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white bg-opacity-70">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(state.pagination.page - 1)}
                      disabled={state.pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(state.pagination.page + 1)}
                      disabled={state.pagination.page >= totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(state.pagination.page - 1) * state.pagination.limit + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(state.pagination.page * state.pagination.limit, filteredUrls.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredUrls.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(state.pagination.page - 1)}
                          disabled={state.pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                              state.pagination.page === i + 1
                                ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(state.pagination.page + 1)}
                          disabled={state.pagination.page >= totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;