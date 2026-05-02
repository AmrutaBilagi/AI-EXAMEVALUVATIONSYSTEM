import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, UploadCloud, Users, Settings as SettingsIcon, LogOut, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const getNavItems = (role) => {
  if (role === 'student') {
    return [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Upload Answer Sheet', path: '/student/upload', icon: UploadCloud },
      { name: 'My Results', path: '/student/results', icon: FileText },
      { name: 'Settings', path: '/student/settings', icon: SettingsIcon },
    ];
  }
  if (role === 'teacher') {
    return [
      { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
      { name: 'Upload Exam', path: '/teacher/upload', icon: UploadCloud },
      { name: 'Evaluate', path: '/teacher/evaluation', icon: CheckCircle },
      { name: 'Settings', path: '/teacher/settings', icon: SettingsIcon },
    ];
  }
  if (role === 'admin') {
    return [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
    ];
  }
  return [];
};

export function Sidebar({ role }) {
  const items = getNavItems(role);
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 transition-colors duration-200 z-20 shadow-xl shadow-slate-200/20 dark:shadow-none">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
          <CheckCircle className="w-8 h-8" />
          <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">Eval</span>
          </span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={twMerge(
                clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                )
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 dark:bg-primary-500 rounded-r-full"></span>
              )}
              <item.icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 dark:text-slate-500")} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400" />
          Logout
        </NavLink>
      </div>
    </div>
  );
}
