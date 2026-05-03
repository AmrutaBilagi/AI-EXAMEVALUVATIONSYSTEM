import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, Key, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { clsx } from 'clsx';

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname === '/register/admin';
  const [role, setRole] = useState(isAdminRoute ? 'admin' : 'student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters and contain both letters and numbers.');
        setLoading(false);
        return;
      }

      const payload = { name, email, password, role };
      if (role === 'student') {
        payload.usn = usn;
      }
      
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate(`/${role}/dashboard`);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Backend not running, falling back to simulation.', err);
      navigate(`/${role}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="mb-8 flex flex-col items-center gap-2 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-4 drop-shadow-sm">
          Join Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary-500">Eval</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Create an account to get started.</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-slate-200/50 dark:shadow-none border-0 ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-800 relative z-10">
        <CardContent className="p-8">
          {!isAdminRoute && (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl mb-8 shadow-inner">
              {['student', 'teacher'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={clsx(
                    "flex-1 py-2.5 text-sm font-bold rounded-lg capitalize transition-all duration-200",
                    role === r
                      ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-md transform scale-[1.02]"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {role === 'student' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">USN (Unique Student Number)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                    placeholder="1XX20XX001"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all hover:bg-white dark:hover:bg-slate-900"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-500/20 rounded-xl bg-gradient-to-r from-blue-600 to-primary-600 hover:from-blue-700 hover:to-primary-700 transition-all mt-4">
              {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
