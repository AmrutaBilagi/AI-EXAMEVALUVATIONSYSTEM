import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Search, Edit, Trash2, Loader2, Download, Filter } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEdit = async (user) => {
    const newName = window.prompt("Edit Name:", user.name);
    if (!newName) return;
    const newRole = window.prompt("Edit Role (student, teacher, admin):", user.role);
    if (!newRole) return;

    try {
      await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, role: newRole })
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="border-0 shadow-md dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">User Management</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-sm py-2 pl-2 pr-4 outline-none text-slate-700 dark:text-slate-300 capitalize cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">USN</th>
                  <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500"><Loader2 className="animate-spin w-6 h-6 mx-auto" /></td>
                  </tr>
                ) : users.filter(u => roleFilter === 'all' || u.role === roleFilter).filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">#{user.id}</td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{user.name}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'teacher' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{user.usn || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
