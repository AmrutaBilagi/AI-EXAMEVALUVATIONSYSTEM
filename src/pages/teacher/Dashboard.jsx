import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const data = [
  { name: 'Exam 1', average: 65 },
  { name: 'Exam 2', average: 72 },
  { name: 'Exam 3', average: 68 },
  { name: 'Exam 4', average: 75 },
  { name: 'Exam 5', average: 82 },
];

export function TeacherDashboard() {
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    submissions: 0,
    evaluated: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = React.useState([]);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, subsRes] = await Promise.all([
          fetch('http://localhost:5000/api/users'),
          fetch('http://localhost:5000/api/teacher/submissions')
        ]);
        const users = await usersRes.json();
        const submissions = await subsRes.json();

        const students = users.filter(u => u.role === 'student').length;
        const evaluated = submissions.filter(s => s.status === 'Evaluated').length;

        setStats({
          totalStudents: students,
          submissions: submissions.length,
          evaluated: evaluated,
        });

        setRecentSubmissions(submissions.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch teacher dashboard data", err);
      }
    };
    fetchDashboardData();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Submissions</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.submissions}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Evaluated</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.evaluated}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Class Average</p>
              <h3 className="text-2xl font-bold text-slate-800">76%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="average" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((sub, i) => (
                <div key={sub.id || i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center font-semibold text-slate-600">
                      S{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{sub.name || `Student ${i+1}`}</p>
                      <p className="text-xs text-slate-500">{sub.usn || 'No USN'}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'Evaluated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {sub.status || 'Pending Evaluation'}
                  </span>
                </div>
              ))}
              {recentSubmissions.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No submissions yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
