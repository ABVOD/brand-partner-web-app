import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TEST_CREDENTIALS } from '../utils/dummyData';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
    }
    setLoading(false);
  }

  const quickFillEmail = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('test123'); // Any password works
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl border border-gray-700 sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Test Accounts Section */}
          <div className="mb-6 p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-purple-300">🧪 Test Accounts</h3>
              <button
                type="button"
                onClick={() => setShowTestAccounts(!showTestAccounts)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                {showTestAccounts ? 'Hide' : 'Show'} Accounts
              </button>
            </div>
            
            {showTestAccounts && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-purple-300 mb-2">Click any email to auto-fill (any password works):</p>
                
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-purple-300">👑 Admin Accounts:</p>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.ADMIN)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.ADMIN} (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.SUPER_ADMIN)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.SUPER_ADMIN} (Super Admin)
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-purple-300">🏢 Brand Partners:</p>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.STARBUCKS)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.STARBUCKS} (Starbucks)
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.MCDONALDS)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.MCDONALDS} (McDonald's)
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-purple-300">🧪 Quick Test:</p>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.TEST)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.TEST} (Test User)
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFillEmail(TEST_CREDENTIALS.DEMO)}
                    className="block text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {TEST_CREDENTIALS.DEMO} (Demo User)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or click a test account above"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any password works for test accounts"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 