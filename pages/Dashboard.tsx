import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { auth } from '../services/authService';

const Dashboard: React.FC = () => {
  const { user } = auth.getAuthState();
  const tests = db.getTests();
  const submissions = db.getSubmissions();
  const [activeFilter, setActiveFilter] = useState<'All' | 'HTML' | 'JavaScript' | 'DSA'>('All');

  if (user?.role === 'admin') {
    return (
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Console</h1>
            <p className="text-slate-500 font-medium">Monitoring cohort progress and evaluation metrics.</p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
            + New Assessment
          </button>
        </header>

        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Students', value: db.getUsers().length, icon: 'fa-users', color: 'text-blue-600' },
            { label: 'Active Tests', value: tests.length, icon: 'fa-file-code', color: 'text-indigo-600' },
            { label: 'Submissions', value: submissions.length, icon: 'fa-check-double', color: 'text-emerald-600' },
            { label: 'Integrity Alerts', value: '0', icon: 'fa-shield-alt', color: 'text-rose-600' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className={`w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center ${stat.color} mb-4`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Deployments</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Title</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Cohort</th>
                  <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map(test => (
                  <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{test.title}</td>
                    <td className="px-6 py-4 text-slate-500">{test.assignedCohort}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded border border-emerald-100">LIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard Logic
  const mySubmissions = submissions.filter(s => s.studentId === user?.id);
  const topics = ['All', 'HTML', 'JavaScript', 'DSA'] as const;

  const filteredTests = tests.filter(test => {
    if (activeFilter === 'All') return true;
    // Check if test sections contain questions from selected category
    const sectionQuestions = test.sections.flatMap(s => s.questionIds.map(id => db.getQuestion(id)));
    return sectionQuestions.some(q => q?.category === activeFilter);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Hello, {user?.name.split(' ')[0]}</h1>
          <p className="text-slate-500 font-medium">Ready for your next technical milestone?</p>
        </div>
        <div className="p-1 bg-slate-100 rounded-xl flex">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setActiveFilter(topic)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeFilter === topic ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTests.map(test => {
          const sub = mySubmissions.find(s => s.testId === test.id);
          const hasSubmitted = !!sub;
          
          return (
            <div key={test.id} className={`p-8 bg-white border-2 rounded-3xl transition-all flex flex-col justify-between ${
              hasSubmitted 
              ? 'border-slate-100 opacity-60' 
              : 'border-slate-200 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/5'
            }`}>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasSubmitted ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}>
                    <i className={`fas ${hasSubmitted ? 'fa-check' : 'fa-code'} text-xl`}></i>
                  </div>
                  {hasSubmitted ? (
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600 tracking-tighter">{sub.score} <span className="text-xs text-slate-400">PTS</span></div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</div>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest border border-slate-200">
                      {test.duration} MIN
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{test.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed italic">
                  Topic: {test.sections.map(s => s.title).join(', ')}
                </p>
              </div>

              {!hasSubmitted && (
                <Link
                  to={`/student/assessment/${test.id}`}
                  className="w-full py-4 bg-slate-900 text-white text-center rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Start Assessment
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <section className="pt-12 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Performance History</h3>
        <div className="grid grid-cols-3 gap-6">
          {mySubmissions.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No previous deployments found</p>
            </div>
          ) : (
            mySubmissions.map(sub => {
              const test = tests.find(t => t.id === sub.testId);
              return (
                <div key={sub.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{test?.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg font-black text-slate-900">{sub.score}</div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;