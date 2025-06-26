import React, { useEffect, useState } from 'react';
import type { ShortUrl } from '../types/urlTypes';
import { createShortUrl, getUserUrls, logoutUser } from '../api/Api';
import { handleApiError } from '../error/errorHandler';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const UrlShortenerHome: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);


  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  
  const navigate = useNavigate()

    useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getUserUrls();
        console.log('all urls fetched =======',data)
        setUrls(data);
        setError('');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'No links found. Try shortening your first URL!';
        setError(errorMsg);
      }
    };

    fetchUrls();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;
    const newUrl: ShortUrl = await createShortUrl(originalUrl);
    setUrls((prev) => [newUrl, ...prev]);
    setOriginalUrl('');
     setError('');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      navigate('/login'); // 👈 redirect to login page
    } catch (error) {
      alert('Logout failed!');
      console.error(error);
    }
  };

  const handleCopy = async (shortUrl: string, id: string) => {
    try {
      const fullShortUrl = `${import.meta.env.VITE_API_BASE_URL}/url/${shortUrl}`;
      await navigator.clipboard.writeText(fullShortUrl);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2000); // Reset after 2s
    } catch (err) {
      handleApiError(err)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 px-4 py-10 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-2 rounded-lg shadow-sm border border-red-200 transition"
      >
        Logout
      </button>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center mt-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            🔗 Futuristic URL Shortener
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            Instantly shorten long links with modern design
          </p>
        </div>
        <div className="text-center text-gray-600 text-sm">
    Welcome, <span className="font-semibold text-cyan-700">{user?.username}</span>
  </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 space-y-4"
        >
          <label htmlFor="url" className="text-gray-700 font-medium">
            Paste your long URL
          </label>
          <input
            type="url"
            id="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/some/long/link"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-800 placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            Shorten URL
          </button>
           {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
            )}
        </form>
       

        {/* Shortened URLs */}
        {urls.length > 0 && (
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Shortened URLs</h2>
            <ul className="space-y-4">
              {urls.map((url) => (
                <li
                  key={url._id}
                  className="bg-cyan-50 border border-cyan-100 p-4 rounded-lg flex flex-col gap-3 md:flex-row md:justify-between md:items-center"
                >
                  <div className="text-gray-700 break-all">
                    <span className="font-medium">Original:</span> {url.originalUrl}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/url/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 font-medium break-all hover:underline"
                    >
                      {`${import.meta.env.VITE_API_BASE_URL}/url/${url.shortUrl}`}
                    </a>
                    <button
                      onClick={() => handleCopy(url.shortUrl, url._id)}
                      className="px-3 py-1 text-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-md shadow-sm transition"
                    >
                      {copiedUrlId === url._id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortenerHome;
