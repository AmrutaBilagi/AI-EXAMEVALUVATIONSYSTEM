import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UploadCloud, FileText, CheckCircle, X, Loader2, Edit3, Save } from 'lucide-react';
import { clsx } from 'clsx';

function FileDropzone({ title, description, file, setFile, accept = "application/pdf" }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === accept) setFile(selectedFile);
    else alert(`Please upload a valid ${accept} file.`);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      
      {!file ? (
        <form 
          className={clsx(
            "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300",
            dragActive 
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]" 
              : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />
          <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md text-primary-500">
              <UploadCloud size={32} />
            </div>
            <p className="text-base font-bold text-slate-800 dark:text-white">Click or drag file here</p>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-24">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export function TeacherUploadExam() {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [modelAnswer, setModelAnswer] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState(null);
  const [rawText, setRawText] = useState(null);
  const [examSaved, setExamSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUploadSubmit = async () => {
    if (!questionPaper || !modelAnswer) {
      alert("Please upload both the Question Paper and Model Answers before submitting.");
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('questionPaper', questionPaper);
      formData.append('modelAnswer', modelAnswer);
      
      const response = await fetch('http://localhost:5000/api/upload-exam-materials', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        setParsedQuestions(data.parsedQuestions);
        if (data.rawText) setRawText(data.rawText);
      } else {
        setErrorMsg('Could not parse PDF correctly');
      }
    } catch (err) {
      console.error("Backend error", err);
      setErrorMsg('Could not parse PDF correctly');
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...parsedQuestions];
    newQuestions[index][field] = value;
    setParsedQuestions(newQuestions);
  };

  const handleSaveExam = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/save-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Exam',
          subject: 'General',
          totalMarks: parsedQuestions.reduce((sum, q) => sum + parseInt(q.marks || 0), 0),
          questions: parsedQuestions,
          createdBy: storedUser.id || 1
        })
      });
      if (response.ok) {
        setExamSaved(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save exam to database');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving exam');
    }
  };

  if (examSaved) {
    return (
      <div className="max-w-4xl mx-auto p-16 flex flex-col items-center text-center space-y-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl animate-in zoom-in duration-500 border border-green-100 dark:border-green-800">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
          <CheckCircle size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Exam Database Configured!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">The structured questions and model answers have been saved. The AI evaluator is now ready.</p>
        </div>
        <Button onClick={() => { setQuestionPaper(null); setModelAnswer(null); setParsedQuestions(null); setExamSaved(false); }} className="mt-8 shadow-lg bg-green-600 hover:bg-green-700 text-white">
          Upload Another Exam
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Upload Exam Materials</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload documents to automatically extract and structure questions for AI evaluation.</p>
      </div>

      {!parsedQuestions ? (
        <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-800 overflow-hidden">
          <CardContent className="p-10 flex flex-col space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FileDropzone 
                title="Question Paper" 
                description="Upload the exam questions (PDF)."
                file={questionPaper}
                setFile={setQuestionPaper}
              />
              <FileDropzone 
                title="Model Answers" 
                description="Upload the ideal answers (PDF)."
                file={modelAnswer}
                setFile={setModelAnswer}
              />
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              {errorMsg && <p className="text-red-500 font-bold">{errorMsg}</p>}
              <Button 
                onClick={handleUploadSubmit} 
                disabled={uploading || (!questionPaper || !modelAnswer)} 
                className="h-12 px-8 text-lg shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 transition-all disabled:opacity-50 ml-auto"
              >
                {uploading ? <><Loader2 className="animate-spin mr-2" /> Parsing Documents...</> : 'Extract & Parse Content'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-4">
            <Edit3 className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100">Review Parsed Data</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We've extracted the questions and marks. Please verify and edit them below before saving to the database. Automatic parsing can sometimes be inaccurate.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {parsedQuestions.length > 0 ? parsedQuestions.map((q, idx) => (
              <Card key={idx} className="border-0 shadow-md dark:bg-slate-800 border-l-4 border-l-primary-500 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Q. Number</label>
                      <input 
                        value={q.question_number}
                        onChange={(e) => handleQuestionChange(idx, 'question_number', e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-2 focus:ring-primary-500 dark:text-white font-mono"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Marks</label>
                      <input 
                        type="number"
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(idx, 'marks', e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-2 focus:ring-primary-500 dark:text-white text-center font-bold"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Question Text</label>
                      <textarea 
                        value={q.question_text}
                        onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                        rows={2}
                        className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-2 focus:ring-primary-500 dark:text-white resize-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Model Answer / Keywords</label>
                    <textarea 
                      value={q.model_answer}
                      onChange={(e) => handleQuestionChange(idx, 'model_answer', e.target.value)}
                      rows={3}
                      className="w-full mt-1 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="border-0 shadow-md dark:bg-slate-800 border-l-4 border-l-yellow-500 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-bold text-yellow-600 mb-2">No structured questions found. Showing raw text:</h3>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-auto max-h-96 text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                    {rawText || "No text could be extracted."}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8 sticky bottom-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl">
            <Button variant="outline" onClick={() => setParsedQuestions(null)}>Discard</Button>
            <Button onClick={handleSaveExam} className="gap-2 shadow-lg shadow-primary-500/20 bg-primary-600 hover:bg-primary-700 text-white">
              <Save className="w-4 h-4" /> Finalize & Save Exam Structure
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
