import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, CheckCircle, Search, Save, Edit3, XCircle, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

const mockStudents = [
  { id: 1, name: 'John Doe', usn: '1XX20CS001', status: 'Pending', score: null },
  { id: 2, name: 'Jane Smith', usn: '1XX20CS002', status: 'Evaluated', score: 85 },
  { id: 3, name: 'Mike Johnson', usn: '1XX20CS003', status: 'Pending', score: null }
];

const mockEvaluationData = [
  {
    qNo: 'Q1',
    question: 'Explain the principles of OOP.',
    maxMarks: 10,
    studentAnswer: 'OOP stands for Object-Oriented Programming. It uses encapsulation, abstraction, inheritance, and polymorphism to organize code.',
    modelAnswer: 'Object-Oriented Programming relies on four main principles: Encapsulation (hiding state), Abstraction (hiding implementation), Inheritance (reusing code), and Polymorphism (many forms).',
    aiScore: 8,
    aiFeedback: 'Good understanding of the core 4 principles. Missing detailed explanation of what each principle does.',
  },
  {
    qNo: 'Q2',
    question: 'What is a binary tree?',
    maxMarks: 5,
    studentAnswer: 'A binary tree is a tree where each node has two children.',
    modelAnswer: 'A tree data structure in which each node has at most two children, referred to as the left child and the right child.',
    aiScore: 3,
    aiFeedback: 'Partially correct. A node has "at most" two children, not strictly two.',
  }
];

export function TeacherEvaluation() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evaluation, setEvaluation] = useState(mockEvaluationData);
  const [saved, setSaved] = useState(false);

  const handleScoreChange = (index, value) => {
    const newEval = [...evaluation];
    newEval[index].aiScore = Math.min(Math.max(0, Number(value)), newEval[index].maxMarks);
    setEvaluation(newEval);
  };

  const handleSaveEvaluation = () => {
    setSaved(true);
    setTimeout(() => {
      setSelectedStudent(null);
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">AI Evaluation Sandbox</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review AI-assigned scores against actual student answer sheets.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Student List */}
        <Card className="w-1/3 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-800 flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4 flex-shrink-0">
            <CardTitle className="dark:text-white flex items-center justify-between">
              Submissions
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{mockStudents.length} Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {mockStudents.map(student => (
                <div 
                  key={student.id} 
                  onClick={() => setSelectedStudent(student)}
                  className={clsx(
                    "p-4 cursor-pointer transition-colors border-l-4",
                    selectedStudent?.id === student.id 
                      ? "bg-primary-50 dark:bg-primary-900/20 border-l-primary-500" 
                      : "border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{student.usn}</p>
                    </div>
                    {student.status === 'Evaluated' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> {student.score}/100
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Main Area: Evaluation Workspace */}
        <Card className="flex-1 border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-800 flex flex-col">
          {!selectedStudent ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner text-slate-300">
                <FileText size={40} />
              </div>
              <p className="text-lg font-medium">Select a student submission to begin review</p>
            </div>
          ) : saved ? (
            <div className="flex flex-col items-center justify-center h-full text-green-600 space-y-4 animate-in zoom-in">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle size={48} />
              </div>
              <p className="text-2xl font-bold">Grades Finalized!</p>
              <p className="text-slate-500 text-sm">Saving to database...</p>
            </div>
          ) : (
            <>
              <CardHeader className="border-b border-slate-100 dark:border-slate-700 p-6 flex-shrink-0 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div>
                  <CardTitle className="dark:text-white text-xl">Reviewing: {selectedStudent.name}</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">USN: {selectedStudent.usn}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Score</p>
                    <p className="text-2xl font-black text-primary-600 dark:text-primary-400">
                      {evaluation.reduce((acc, curr) => acc + curr.aiScore, 0)} <span className="text-sm text-slate-400">/ {evaluation.reduce((acc, curr) => acc + curr.maxMarks, 0)}</span>
                    </p>
                  </div>
                  <Button onClick={handleSaveEvaluation} className="gap-2 shadow-lg shadow-primary-500/20">
                    <Save className="w-4 h-4" /> Finalize Grades
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 overflow-y-auto flex-1 space-y-8 bg-slate-50/50 dark:bg-slate-900/20">
                {evaluation.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-start">
                      <div className="flex-1 pr-6">
                        <span className="font-bold text-primary-600 dark:text-primary-400 mr-2">{item.qNo}.</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{item.question}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">AI Assigned Score</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={item.aiScore} 
                            onChange={(e) => handleScoreChange(idx, e.target.value)}
                            className="w-16 text-center font-black text-xl text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-md outline-none focus:ring-2 focus:ring-primary-500 p-1"
                            min="0"
                            max={item.maxMarks}
                          />
                          <span className="text-slate-400 font-medium">/ {item.maxMarks}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                      <div className="p-5 space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                          <Edit3 className="w-3 h-3" /> Student's Extracted Answer
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          {item.studentAnswer}
                        </p>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Model Answer
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                            {item.modelAnswer}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-orange-500 uppercase flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> AI Feedback
                          </h4>
                          <p className="text-sm text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                            {item.aiFeedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
