import { useState } from 'react';
import { shortenUrl } from '../services/api';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const UrlShortenerForm = ({ onShorten }) => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (urlString) => {
    try {
      // Add https:// if missing
      let processedUrl = urlString;
      if (!/^https?:\/\//i.test(urlString)) {
        processedUrl = `https://${urlString}`;
      }
      
      new URL(processedUrl);
      return processedUrl;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const validatedUrl = validateUrl(url);
    if (!validatedUrl) {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await shortenUrl({
        originalUrl: validatedUrl,
        customCode: customCode.trim() || undefined
      });
      onShorten(result);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="example.com or https://example.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
            Custom code (optional)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="my-custom-link"
            pattern="[a-zA-Z0-9-]+"
            title="Only letters, numbers, and hyphens are allowed"
          />
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${
            isLoading ? 'bg-primary-light' : 'bg-primary hover:bg-primary-dark'
          } transition-colors`}
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlShortenerForm;