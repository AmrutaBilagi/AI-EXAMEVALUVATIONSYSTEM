import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookOpen, Award, TrendingUp, Download, CheckCircle, Loader2, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function StudentDashboard() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const averageScore = 63.25; // Simulated low score for demonstration

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      alert("Latest Result Report Downloaded Successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your academic performance overview.</p>
        </div>
        <Button onClick={handleDownload} disabled={isDownloading} className="gap-2 shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 transition-all">
          {isDownloading ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
          {isDownloading ? 'Generating PDF...' : 'Download Latest Result'}
        </Button>
      </div>

      {averageScore < 70 && (
        <Card className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-l-4 border-l-orange-500 shadow-sm">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 mt-1">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Improvement Required <AlertTriangle className="w-4 h-4 text-orange-500" />
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm leading-relaxed">
                Your average score is currently <strong>{averageScore}%</strong>, which is below the target threshold. Here are some AI-generated tips to improve your performance:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <strong>Focus on Physics:</strong> You scored 58%. Review mechanics and thermodynamics concepts.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <strong>Keyword Matching:</strong> The AI evaluator noted missing key terms in your long answers. Always include proper technical terminology.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <strong>Attempt All Questions:</strong> You left 2 questions blank in Chemistry. Even partial attempts can yield marks.
                </li>
              </ul>
              <Button onClick={() => navigate('/student/results')} variant="outline" className="mt-4 border-orange-200 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/30">
                View Detailed Weakness Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md dark:bg-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Exams Taken</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md dark:bg-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-inner">
              <Award size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Average Score</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{averageScore}%</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md dark:bg-slate-800 transform hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Overall Grade</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">C+</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md dark:bg-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <CardTitle className="dark:text-white">Recent Evaluated Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              { subject: 'Physics Midterm', score: '58/100', grade: 'C', date: 'Oct 15' },
              { subject: 'Chemistry Quiz', score: '15/25', grade: 'C+', date: 'Oct 10' },
              { subject: 'Math Assignment', score: '65/100', grade: 'B-', date: 'Oct 05' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">{item.subject}</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Evaluated on {item.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{item.score}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                      Grade {item.grade}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => navigate('/student/results')} variant="ghost" className="w-full mt-6 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 group">
            View Analytics & Full Results <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
