import React from 'react';
import { db } from '../services/dbService';
import { auth } from '../services/authService';

const ResultsView: React.FC = () => {
  const { user } = auth.getAuthState();
  const submissions = db.getSubmissions().filter(s => s.studentId === user?.id);
  const tests = db.getTests();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Performance</h1>
        <p className="text-slate-500 font-medium">Detailed review of your assessment milestones.</p>
      </header>

      {submissions.length === 0 ? (
        <div className="bg-slate-50 p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <i className="fas fa-poll-h text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-400">No data points captured</h2>
          <p className="text-slate-500 mt-2 font-medium">Your progress will appear here after your first assessment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map(sub => {
            const test = tests.find(t => t.id === sub.testId);
            const scorePercent = Math.round((sub.score / (test?.totalMarks || 100)) * 100);
            
            return (
              <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center gap-10 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
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
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">
                      {sub.score} / {test?.totalMarks} Marks
                    </span>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">
                      {Math.floor(sub.timeTaken / 60)}m {sub.timeTaken % 60}s
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {['Logic', 'Syntax', 'Optimization', 'Documentation'].map((topic, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{topic}</div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${60 + (i * 10)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="px-6 py-3 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-xl font-bold text-sm transition-all shadow-sm">
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