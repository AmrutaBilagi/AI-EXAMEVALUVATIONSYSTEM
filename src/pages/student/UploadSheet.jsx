import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UploadCloud, File, CheckCircle, X, Loader2 } from 'lucide-react';

export function StudentUploadSheet() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadSuccess(false);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadSuccess(false);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleUploadSubmit = () => {
    if (!file) return;
    setUploading(true);
    // Simulate API upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Upload Answer Sheet</h1>
        <p className="text-slate-500 dark:text-slate-400">Submit your final exam PDF for automated evaluation.</p>
      </div>

      <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {!uploadSuccess ? (
            <div className="p-10">
              <form 
                className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  dragActive 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]" 
                    : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onSubmit={(e) => e.preventDefault()}
              >
                <input 
                  ref={inputRef} 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleChange} 
                />
                
                {!file ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md text-primary-500">
                      <UploadCloud size={40} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">Drag and drop your PDF here</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">or click below to browse your files</p>
                    </div>
                    <Button type="button" onClick={onButtonClick} variant="outline" className="mt-4 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/30">
                      Select File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-6 w-full max-w-md">
                    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                          <File size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={removeFile} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <Button onClick={handleUploadSubmit} disabled={uploading} className="w-full h-12 text-lg shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 transition-all">
                      {uploading ? (
                        <><Loader2 className="animate-spin mr-2" /> Uploading...</>
                      ) : (
                        'Submit Answer Sheet'
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center text-center space-y-6 bg-green-50/50 dark:bg-green-900/10">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 animate-in zoom-in">
                <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Upload Successful!</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Your answer sheet has been securely submitted for evaluation.</p>
              </div>
              <Button onClick={() => { setFile(null); setUploadSuccess(false); }} variant="outline" className="mt-4">
                Upload Another File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
