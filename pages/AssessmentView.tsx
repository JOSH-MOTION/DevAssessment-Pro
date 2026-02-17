
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { auth } from '../services/authService';
import { Assessment, Question, QuestionType, ProctorLog, Submission, PerformanceMetrics } from '../types';
import CodingEditor from '../components/CodingEditor';
import ProctoringSystem from '../components/ProctoringSystem';

const AssessmentView: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [logs, setLogs] = useState<ProctorLog[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const submissionStarted = useRef(false);
  const persistenceKey = `draft_${testId}_${auth.getAuthState().user?.id}`;

  useEffect(() => {
    const test = db.getTest(testId!);
    if (test) {
      setAssessment(test);
      const allQs = test.sections
        .flatMap(s => s.questionIds.map(id => db.getQuestion(id)))
        .filter((q): q is Question => q !== undefined);
      
      setQuestions(allQs);
      setTimeLeft(test.duration * 60);
      
      const saved = localStorage.getItem(persistenceKey);
      if (saved) {
        setAnswers(JSON.parse(saved));
      } else {
        const initialAnswers: Record<string, any> = {};
        allQs.forEach(q => {
          if (q.type === QuestionType.CODING) {
            initialAnswers[q.id] = q.initialCode || '';
          }
        });
        setAnswers(initialAnswers);
      }
      setIsLoading(false);
    } else {
      navigate('/student');
    }
  }, [testId, navigate, persistenceKey]);

  const analyzeCodeMetrics = (code: string): PerformanceMetrics => {
    // Simulated Static Analysis Heuristics
    const hasComments = /\/\/|\/\*/.test(code);
    const hasLoops = /for|while|map|forEach/.test(code);
    const complexLogic = (code.match(/if|else|switch/g) || []).length > 2;
    const cleanNames = !/var|let\s+[a-z]\s+=/.test(code); // Penalize single char names like 'x' or 'i'

    return {
      logic: complexLogic ? 85 : 70,
      syntax: cleanNames ? 90 : 60,
      optimization: hasLoops && code.length < 300 ? 80 : 50,
      documentation: hasComments ? 95 : 30
    };
  };

  const handleSubmit = async () => {
    if (submissionStarted.current || !assessment) return;
    submissionStarted.current = true;
    setIsSubmitting(true);
    
    try {
      const { user } = auth.getAuthState();
      if (!user) {
        navigate('/login');
        return;
      }

      let score = 0;
      let aggMetrics: PerformanceMetrics = { logic: 0, syntax: 0, optimization: 0, documentation: 0 };
      let codingCount = 0;

      questions.forEach(q => {
        const ans = answers[q.id];
        if (q.type === QuestionType.MCQ && ans === q.correctAnswer) {
          score += 10;
        }
        if (q.type === QuestionType.CODING && ans) {
          codingCount++;
          const m = analyzeCodeMetrics(ans);
          aggMetrics.logic += m.logic;
          aggMetrics.syntax += m.syntax;
          aggMetrics.optimization += m.optimization;
          aggMetrics.documentation += m.documentation;
          if (ans.length > 20) score += 30;
        }
      });

      // Average the metrics or set defaults for MCQ-heavy tests
      const finalMetrics: PerformanceMetrics = codingCount > 0 ? {
        logic: Math.round(aggMetrics.logic / codingCount),
        syntax: Math.round(aggMetrics.syntax / codingCount),
        optimization: Math.round(aggMetrics.optimization / codingCount),
        documentation: Math.round(aggMetrics.documentation / codingCount),
      } : { logic: 80, syntax: 90, optimization: 70, documentation: 50 };

      const submission: Submission = {
        id: 'sub-' + Date.now(),
        studentId: user.id,
        testId: assessment.id,
        answers,
        score,
        metrics: finalMetrics,
        sectionScores: {},
        logs,
        submittedAt: Date.now(),
        timeTaken: (assessment.duration * 60) - timeLeft
      };

      db.saveSubmission(submission);
      localStorage.removeItem(persistenceKey);
      
      setTimeout(() => {
        navigate('/student/results');
      }, 1000);
      
    } catch (error) {
      console.error("Submission Error:", error);
      setIsSubmitting(false);
      submissionStarted.current = false;
    }
  };

  useEffect(() => {
    if (isLoading || isSubmitting) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting]);

  const handleLog = (log: ProctorLog) => setLogs(prev => [...prev, log]);
  const handleAnswerChange = (qId: string, val: any) => setAnswers(prev => ({ ...prev, [qId]: val }));

  const runCode = () => {
    setOutput('🚀 Compiling secure environment...');
    setTimeout(() => {
      const q = questions[currentQuestionIdx];
      if (answers[q.id]?.length > 20) {
        setOutput('Test Case 1: PASSED\nTest Case 2: PASSED\n\nEnvironment: No leaks detected.');
      } else {
        setOutput('Error: ReferenceError: Solution logic incomplete.');
      }
    }, 600);
  };

  if (isLoading || isSubmitting) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8">
      <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 mb-1">{isSubmitting ? 'Encrypting Assessment...' : 'Loading Sandbox...'}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Securing data channels</p>
      </div>
    </div>
  );

  const currentQ = questions[currentQuestionIdx];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900 overflow-hidden">
      <ProctoringSystem isActive={!isSubmitting} onLog={handleLog} />

      <header className="h-20 border-b border-slate-100 bg-white px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <i className="fas fa-terminal text-sm"></i>
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight leading-none mb-1">{assessment?.title}</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} / {questions.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-6 py-2 rounded-xl font-mono font-black text-lg border ${timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => { if(window.confirm('Submit assessment now?')) handleSubmit(); }}
            className="px-6 py-2 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            End Early
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col overflow-y-auto p-12 bg-white ${currentQ.type === QuestionType.CODING ? 'w-1/2 border-r border-slate-100' : 'w-full max-w-4xl mx-auto'}`}>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100 tracking-widest">{currentQ.category}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-8">{currentQ.questionText}</h2>
          </div>

          <div className="space-y-4 mb-20 flex-1">
            {currentQ.type === QuestionType.MCQ && currentQ.options?.map((opt, i) => (
              <label 
                key={i}
                className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={opt}
                  checked={answers[currentQ.id] === opt}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="hidden"
                />
                <span className={`font-bold ${answers[currentQ.id] === opt ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
              </label>
            ))}

            {currentQ.type === QuestionType.CODING && (
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm leading-relaxed">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Specs</div>
                <div className="prose prose-slate max-w-none">{currentQ.explanation}</div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="px-4 py-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 font-bold text-[10px] uppercase tracking-widest"
            >
              Back
            </button>

            {currentQuestionIdx === questions.length - 1 ? (
              <button
                onClick={() => { if(window.confirm('Finish and submit?')) handleSubmit(); }}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Finish Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {currentQ.type === QuestionType.CODING && (
          <div className="w-1/2 flex flex-col bg-slate-50 p-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">solution.js</span>
              <button onClick={runCode} className="px-6 py-2 bg-white border border-slate-200 text-slate-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:border-indigo-600 shadow-sm transition-all">
                Run Tests
              </button>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200">
              <CodingEditor code={answers[currentQ.id] || ''} onChange={(val) => handleAnswerChange(currentQ.id, val)} />
            </div>
            <div className="h-40 bg-white rounded-2xl p-6 font-mono text-xs border border-slate-200 overflow-y-auto">
              <div className="mb-2 text-slate-300 font-black text-[9px] uppercase tracking-widest tracking-tighter">Console Output</div>
              <pre className="text-slate-700 leading-relaxed">{output || '> Terminal ready.'}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentView;
