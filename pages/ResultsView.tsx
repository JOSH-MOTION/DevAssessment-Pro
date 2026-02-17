
import React, { useState } from 'react';
import { db } from '../services/dbService';
import { auth } from '../services/authService';
import { Submission, PerformanceMetrics } from '../types';

interface AnalysisModalProps {
  submission: Submission;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ submission, onClose }) => {
  const metrics = submission.metrics || { logic: 0, syntax: 0, optimization: 0, documentation: 0 };
  
  const metricInfo = {
    logic: {
      title: 'Logic & Algorithm',
      desc: 'Measures the correctness of your problem-solving approach. High scores indicate efficient use of conditionals and error handling.',
      tip: 'Focus on breaking complex problems into smaller, testable functions.'
    },
    syntax: {
      title: 'Syntax & Cleanliness',
      desc: 'Evaluates code readability and adherence to standard practices. We look for meaningful variable names and consistent formatting.',
      tip: 'Use descriptive names like `customerList` instead of `arr`.'
    },
    optimization: {
      title: 'Performance Optimization',
      desc: 'Assesses the efficiency of your solution. We check for redundant loops and unnecessary memory consumption.',
      tip: 'Consider using Map or Set data structures for O(1) lookups.'
    },
    documentation: {
      title: 'Documentation & Intent',
      desc: 'Evaluates how well you communicate your logic. Comments and JSDoc help other engineers understand your work.',
      tip: 'Always comment *why* a decision was made, not just *what* the code is doing.'
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-12">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Deep Performance Audit</h2>
              <p className="text-slate-500 font-medium">Detailed engineering metrics for Submission #{submission.id.split('-')[1]}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
              <i className="fas fa-times"></i>
            </button>
          </header>

          <div className="grid grid-cols-2 gap-10">
            {Object.entries(metrics).map(([key, value]) => {
              const info = metricInfo[key as keyof typeof metricInfo];
              return (
                <div key={key} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{info.title}</h4>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Efficiency: {value}%</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${value}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{info.desc}</p>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Growth Action</span>
                    <p className="text-xs text-indigo-900 font-bold">{info.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-10">
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</div>
                <div className="text-2xl font-black text-slate-900">{submission.score} PTS</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Status</div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <i className="fas fa-check-circle text-xs"></i>
                  <span className="text-sm font-bold">Verified Compliant</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
              Acknowledge Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsView: React.FC = () => {
  const { user } = auth.getAuthState();
  const submissions = db.getSubmissions().filter(s => s.studentId === user?.id);
  const tests = db.getTests();
  const [selectedAnalysisSub, setSelectedAnalysisSub] = useState<Submission | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      {selectedAnalysisSub && (
        <AnalysisModal 
          submission={selectedAnalysisSub} 
          onClose={() => setSelectedAnalysisSub(null)} 
        />
      )}

      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Performance</h1>
        <p className="text-slate-500 font-medium">Review your engineering growth and assessment history.</p>
      </header>

      {submissions.length === 0 ? (
        <div className="bg-slate-50 p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <i className="fas fa-poll-h text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-400">No telemetry captured</h2>
          <p className="text-slate-500 mt-2 font-medium">Assessment results will synchronize here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map(sub => {
            const test = tests.find(t => t.id === sub.testId);
            const scorePercent = Math.round((sub.score / (test?.totalMarks || 100)) * 100);
            
            return (
              <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center gap-10 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all">
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="50" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle cx="56" cy="56" r="50" stroke="#4f46e5" strokeWidth="8" fill="transparent" 
                            strokeDasharray={314} strokeDashoffset={314 - (314 * scorePercent / 100)} 
                            className="transition-all duration-1000" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">{scorePercent}%</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{test?.title}</h3>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-widest">
                      {sub.score} Points Secured
                    </span>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-widest">
                      {Math.floor(sub.timeTaken / 60)}m {sub.timeTaken % 60}s Duration
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {['logic', 'syntax', 'optimization', 'documentation'].map((metricKey) => {
                      const val = (sub.metrics as any)?.[metricKey] || 0;
                      return (
                        <div key={metricKey} className="space-y-1.5">
                          <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{metricKey}</div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${val}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedAnalysisSub(sub)}
                  className="px-6 py-4 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
                >
                  View Analysis
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultsView;
