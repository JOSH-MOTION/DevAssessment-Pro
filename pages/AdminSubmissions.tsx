import React, { useState } from 'react';
import { db } from '../services/dbService';

const AdminSubmissions: React.FC = () => {
  const submissions = db.getSubmissions();
  const tests = db.getTests();
  const students = db.getUsers();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const selectedSub = submissions.find(s => s.id === selectedSubmissionId);
  const selectedStudent = students.find(s => s.id === selectedSub?.studentId);
  const selectedTest = tests.find(t => t.id === selectedSub?.testId);

  return (
    <div className="h-full flex gap-10">
      <div className="flex-1 space-y-8">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Submissions</h1>
          <p className="text-slate-500 font-medium">Verify cohort integrity and performance data.</p>
        </header>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Candidate</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Assessment</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Result</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Flags</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(sub => {
                const student = students.find(s => s.id === sub.studentId);
                const test = tests.find(t => t.id === sub.testId);
                const violations = sub.logs.filter(l => l.type !== 'snapshot').length;
                
                return (
                  <tr 
                    key={sub.id} 
                    className={`hover:bg-slate-50 transition-all cursor-pointer ${selectedSubmissionId === sub.id ? 'bg-indigo-50/50' : ''}`}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{student?.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{student?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700">{test?.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Cohort: {student?.cohort}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-indigo-600">{sub.score} <span className="text-[10px] text-slate-400">PTS</span></div>
                    </td>
                    <td className="px-6 py-4">
                      {violations > 0 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded border border-rose-100 tracking-widest">
                          {violations} FLAGS
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-[10px] font-black tracking-widest uppercase">Verified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-900 text-xs font-black uppercase tracking-widest">Inspect</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="w-[400px] bg-white border border-slate-200 rounded-3xl p-8 overflow-y-auto shadow-sm">
        {selectedSub ? (
          <div className="space-y-8">
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Audit Details</h3>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Session Overview</div>
              <div className="space-y-2">
                {[
                  { label: 'Name', val: selectedStudent?.name },
                  { label: 'Time Taken', val: `${Math.floor(selectedSub.timeTaken / 60)}m ${selectedSub.timeTaken % 60}s` },
                  { label: 'Completed', val: new Date(selectedSub.submittedAt).toLocaleTimeString() },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">{item.label}:</span>
                    <span className="text-slate-900 font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Logs</h4>
              <div className="space-y-3">
                {selectedSub.logs.map((log, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    log.type === 'snapshot' ? 'bg-white border-slate-100' : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${log.type === 'snapshot' ? 'bg-slate-100' : 'bg-rose-600 text-white'}`}>
                      <i className={`fas ${log.type === 'snapshot' ? 'fa-camera text-slate-400' : 'fa-bolt'}`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold capitalize">{log.type.replace('-', ' ')}</div>
                      <div className="text-[9px] font-medium opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all">
              Export Forensic PDF
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <i className="fas fa-search-plus text-slate-300 text-4xl mb-4"></i>
            <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs">Ready for Review</h4>
            <p className="text-slate-400 text-xs mt-2 font-medium">Select a student submission to view detailed logs and code snapshots.</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default AdminSubmissions;