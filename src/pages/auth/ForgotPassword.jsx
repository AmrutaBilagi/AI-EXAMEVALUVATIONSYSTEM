import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-50 via-white to-primary-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-200/50 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="mb-8 flex flex-col items-center gap-2 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mt-4 drop-shadow-sm">
          Reset Password
        </h1>
        <p className="text-slate-600 font-medium mt-1 text-center max-w-sm">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-purple-900/5 border-0 ring-1 ring-white/50 bg-white/80 backdrop-blur-xl relative z-10">
        <CardContent className="p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white/50 outline-none transition-all hover:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-purple-500/20 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Check your email</h3>
              <p className="text-slate-600 text-sm">
                We sent a password reset link to <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}

          <div className="mt-8 text-center text-sm font-medium text-slate-600 border-t border-slate-100 pt-6">
            <Link to="/login" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
