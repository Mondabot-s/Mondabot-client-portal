'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  backend: 'checking' | 'connected' | 'error';
  frontend: 'checking' | 'connected' | 'error';
}

export default function DevHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>({
    backend: 'checking',
    frontend: 'checking'
  });
  const [showError, setShowError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !isClient) return;

    const checkHealth = async () => {
      try {
        // Check backend health
        const backendResponse = await fetch('/api/health');
        const frontendHealthy = window.location.port === '3000';
        
        setStatus({
          backend: backendResponse.ok ? 'connected' : 'error',
          frontend: frontendHealthy ? 'connected' : 'error'
        });

        if (!backendResponse.ok || !frontendHealthy) {
          setShowError(true);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus(prev => ({ ...prev, backend: 'error' }));
        setShowError(true);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [isClient]);

  if (process.env.NODE_ENV === 'production' || !isClient) return null;

  return (
    <>
      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          status.backend === 'connected' ? 'bg-green-100 text-green-800' :
          status.backend === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          Backend: {status.backend === 'connected' ? '✅' : status.backend === 'error' ? '❌' : '⏳'}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          status.frontend === 'connected' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          Port: {window.location.port === '3000' ? '✅ 3000' : `❌ ${window.location.port}`}
        </div>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Development Environment Issue
            </h3>
            {status.backend === 'error' && (
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Backend server not running:</p>
                <code className="bg-gray-100 p-2 rounded block text-sm">
                  npm run backend
                </code>
              </div>
            )}
            {window.location.port !== '3000' && (
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Wrong testing port. Use:</p>
                <code className="bg-gray-100 p-2 rounded block text-sm">
                  http://localhost:3000
                </code>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowError(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Dismiss
              </button>
              <button
                onClick={() => window.location.href = 'http://localhost:3000'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to localhost:3000
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 