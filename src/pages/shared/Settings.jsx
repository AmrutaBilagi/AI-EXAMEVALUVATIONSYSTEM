import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Moon, Sun, User, Mail, Shield, Save } from 'lucide-react';
import { clsx } from 'clsx';

export function Settings({ role }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Mock user details - in real app, fetch from backend/context
  const userDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: role,
    joined: 'October 2023'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and theme.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card className="border-0 shadow-lg dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-primary-500/30">
                {userDetails.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userDetails.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 mt-2 capitalize">
                {userDetails.role}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-md dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" /> Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Full Name</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">{userDetails.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">{userDetails.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="dark:text-white flex items-center gap-2">
                {theme === 'light' ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-blue-400" />} 
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Theme Preference</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch between Light and Dark mode.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={clsx(
                    "relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
                    theme === 'dark' ? "bg-primary-600" : "bg-slate-300"
                  )}
                >
                  <span
                    className={clsx(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out",
                      theme === 'dark' ? "translate-x-8" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button className="gap-2 shadow-lg shadow-primary-500/20">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
