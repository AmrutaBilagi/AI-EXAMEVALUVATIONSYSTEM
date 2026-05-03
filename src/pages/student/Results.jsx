import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Award, FileText, ChevronRight } from 'lucide-react';

export function StudentResults() {
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/student/results/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          // Map to chart format
          const formattedData = data.map((item, idx) => ({
            subject: item.exam_title || `Exam ${idx + 1}`,
            score: item.score,
            classAvg: 75, // Mock class average for visualization
          }));
          setChartData(formattedData.reverse()); // Show oldest to newest left to right
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
      }
    };
    fetchResults();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics & Results</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of your academic progression.</p>
        </div>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <CardTitle className="dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            Performance vs Class Average
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="score" name="Your Score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--color-primary-500)" />
                  ))}
                </Bar>
                <Bar dataKey="classAvg" name="Class Average" fill="#cbd5e1" className="dark:fill-slate-600" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <CardTitle className="dark:text-white">Detailed Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No results found yet. Upload an answer sheet to get evaluated!</div>
            ) : results.map((item, i) => (
              <div key={item.id || i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white">{item.exam_title || `Evaluation #${item.id}`}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                        Status: {item.status} &nbsp;&bull;&nbsp; Submitted: {new Date(item.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 self-start md:self-auto ml-16 md:ml-0">
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-800 dark:text-white">{item.score}/{item.max_marks}</p>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        Grade {item.score >= 90 ? 'A' : item.score >= 80 ? 'B' : item.score >= 70 ? 'C' : 'D'}
                      </p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                      <Download size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
