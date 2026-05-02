import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar({ role }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Your midterm results are ready to download.", time: "2 hours ago" },
    { id: 2, text: "New assignment uploaded by Prof. Smith.", time: "1 day ago" }
  ];

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <span className="font-bold text-slate-800 dark:text-white">Notifications</span>
                <span className="text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">View all notifications</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/${role}/settings`)}>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 dark:text-white">John Doe</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{role}</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
