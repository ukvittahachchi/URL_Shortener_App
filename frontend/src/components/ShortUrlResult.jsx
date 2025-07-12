import { useState } from 'react';
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const ShortUrlResult = ({ shortUrl, originalUrl }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!shortUrl) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Your Short URL</h2>
      <div className="flex items-center mb-2">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {shortUrl}
        </a>
        <button
          onClick={copyToClipboard}
          className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
        >
          {isCopied ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Original URL: <span className="break-all">{originalUrl}</span>
      </p>
      {isCopied && (
        <p className="text-green-500 text-sm mt-2 animate-fade-in">Copied to clipboard!</p>
      )}
    </div>
  );
};

export default ShortUrlResult;