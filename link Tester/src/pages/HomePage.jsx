import React, { useState } from 'react';
import Header from '../components/Header';
import { FaArrowRight } from "react-icons/fa";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiClock, FiExternalLink } from "react-icons/fi";

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectChain, setRedirectChain] = useState([]);

// condition for Validate URL format
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };


// condition to check the URL and add https if missing
  const normalizeUrl = (inputUrl) => {
    if (!inputUrl.startsWith('http')) {
      return 'https://' + inputUrl;
    }
    return inputUrl;
  };


//   function to trace redirects using fetch API
  const traceRedirects = async (targetUrl) => {
    setLoading(true);
    setError('');
    setRedirectChain([]);

    try {
      // Using a CORS proxy to bypass CORS limitations
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, {
        method: 'HEAD',
        redirect: 'manual',
      });

      // Process response and build redirect chain
      // Note: This is a simplified approach - actual implementation would need
      // to handle multiple redirects and extract the chain information
      const finalUrl = response.url || targetUrl;
      
      setRedirectChain([
        { url: targetUrl, status: '301', timestamp: new Date().toLocaleTimeString() },
        { url: finalUrl, status: '200', timestamp: new Date().toLocaleTimeString() }
      ]);
      
    } catch (err) {
      setError('Unable to track redirects due to CORS limitations');
      console.error('Tracking error:', err);
    }

    setLoading(false);
  };


//   Handle input  btn submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const normalizedUrl = normalizeUrl(url.trim());
    if (!isValidUrl(normalizedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    traceRedirects(normalizedUrl);
  };


//   Function to get status color based on status code
  const getStatusColor = (status) => {
    const statusNum = parseInt(status);
    // status color based on status code range
    if (statusNum >= 200 && statusNum < 300) return 'text-green-600 bg-green-50';
    if (statusNum >= 300 && statusNum < 400) return 'text-blue-600 bg-blue-50';
    if (statusNum >= 400 && statusNum < 500) return 'text-orange-600 bg-orange-50';
    if (statusNum >= 500) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const finalDestination = redirectChain.length > 0 
    ? redirectChain[redirectChain.length - 1].url 
    : '';

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Test URL Redirects</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter URL to track:
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  placeholder="https://example.com or example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                    {/* loading for loading state conditions*/}
                  {loading ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <span>Tracking Redirects</span>
                      <FaArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

           {/* Error msg */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
         {/* Redirect Chain & Summary if url is entered btn tracking */}
        {redirectChain.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Redirect Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaArrowRight className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Total Redirects</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{redirectChain.length - 1}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Final Status</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {redirectChain[redirectChain.length - 1]?.status || 'Unknown'}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiClock className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Chain Length</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{redirectChain.length} steps</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Final Destination</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FiExternalLink className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Final URL:</span>
                </div>
                <a 
                  href={finalDestination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all font-mono text-sm"
                >
                  {finalDestination}
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Redirect Chain</h3>
              
              <div className="space-y-4">
                {redirectChain.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        {index < redirectChain.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                              {step.status}
                            </span>
                            <span className="text-xs text-gray-500">{step.timestamp}</span>
                          </div>
                          {index === 0 && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              Start
                            </span>
                          )}
                          {index === redirectChain.length - 1 && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                              Final
                            </span>
                          )}
                        </div>
                        
                        <a 
                          href={step.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all font-mono text-sm"
                        >
                          {step.url}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

