import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { clsx } from 'clsx';

export function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save user data securely (e.g., in Context or LocalStorage)
        localStorage.setItem('user', JSON.stringify(data));
        navigate(`/${data.role}/dashboard`);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Backend not running, falling back to simulation.', err);
      // Fallback for demonstration if backend is off
      navigate(`/${role}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="mb-8 flex flex-col items-center gap-2 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-4 drop-shadow-sm">
          Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-500">Eval</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Welcome back! Sign in to continue.</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-slate-200/50 dark:shadow-none border-0 ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-800 relative z-10">
        <CardContent className="p-8">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl mb-8 shadow-inner">
            {['student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all duration-200",
                  role === r
                    ? "bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-400 shadow-md transform scale-[1.02]"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary-500/20 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 transition-all">
              {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </Button>
          </form>

          {role !== 'admin' ? (
            <div className="mt-8 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                Create one now
              </Link>
            </div>
          ) : (
            <div className="mt-8 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-6">
              Don't have an account?{' '}
              <Link to="/register/admin" className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                Register
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
