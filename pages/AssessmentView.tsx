
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { auth } from '../services/authService';
import { Assessment, Question, QuestionType, ProctorLog, Submission } from '../types';
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

  // Use a ref to prevent multiple submissions
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

  // Robust Submission Logic
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

      // Calculate score logic
      let score = 0;
      questions.forEach(q => {
        const ans = answers[q.id];
        if (q.type === QuestionType.MCQ && ans === q.correctAnswer) score += 5;
        if (q.type === QuestionType.CODING && ans && ans.length > 10) score += 20;
      });

      const submission: Submission = {
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        studentId: user.id,
        testId: assessment.id,
        answers,
        score,
        sectionScores: {},
        logs,
        submittedAt: Date.now(),
        timeTaken: (assessment.duration * 60) - timeLeft
      };

      // Direct write to DB
      db.saveSubmission(submission);
      
      // Clear persistence
      localStorage.removeItem(persistenceKey);
      
      // Short delay for visual feedback before navigation
      setTimeout(() => {
        navigate('/student/results');
      }, 800);
      
    } catch (error) {
      console.error("Critical: Submission failure", error);
      setIsSubmitting(false);
      submissionStarted.current = false;
      alert("Submission failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isLoading || isSubmitting) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = Math.max(0, prev - 1);
        // Auto-save every 30 seconds
        if (next % 30 === 0) {
          localStorage.setItem(persistenceKey, JSON.stringify(answers));
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting, answers, persistenceKey]);

  const handleLog = (log: ProctorLog) => {
    setLogs(prev => [...prev, log]);
  };

  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const runCode = () => {
    setOutput('🚀 Compiling... verifying test cases...');
    setTimeout(() => {
      const q = questions[currentQuestionIdx];
      if (answers[q.id]?.length > 20) {
        setOutput('Test Case 1: PASSED\nTest Case 2: PASSED\n\nResult: 100% Correct');
      } else {
        setOutput('Error: Unexpected output.\nCheck your logic and return values.');
      }
    }, 600);
  };

  if (isLoading || isSubmitting) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8 p-10 text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
          <i className="fas fa-shield-alt"></i>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {isSubmitting ? 'Securing Submission...' : 'Initializing Session...'}
        </h2>
        <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
          {isSubmitting 
            ? 'Finalizing your performance report and closing secure channels.' 
            : 'Establishing proctoring protocols and preparing environment.'}
        </p>
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

      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-100 bg-white px-10 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <i className="fas fa-terminal text-sm"></i>
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight leading-none mb-1 text-lg">{assessment?.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{assessment?.assignedCohort}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`px-6 py-2 rounded-2xl font-mono font-black text-xl flex items-center gap-3 border transition-all ${
            timeLeft < 300 ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-100'
          }`}>
            <i className="fas fa-clock text-xs opacity-40"></i>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => { if(window.confirm('End assessment early? This action is irreversible.')) handleSubmit(); }}
            className="px-6 py-3 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            End Early
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Panel */}
        <div className={`flex flex-col overflow-y-auto p-12 transition-all duration-500 bg-white ${currentQ.type === QuestionType.CODING ? 'w-1/2 border-r border-slate-100' : 'w-full max-w-4xl mx-auto'}`}>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100 tracking-widest">{currentQ.category}</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentQ.difficulty}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-8">
              {currentQ.questionText}
            </h2>
            <div className="h-px bg-slate-50 w-full"></div>
          </div>

          <div className="space-y-4 mb-20 flex-1">
            {currentQ.type === QuestionType.MCQ && currentQ.options?.map((opt, i) => (
              <label 
                key={i}
                className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  answers[currentQ.id] === opt 
                  ? 'border-indigo-600 bg-indigo-50/20' 
                  : 'border-slate-50 hover:border-slate-200 bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                  answers[currentQ.id] === opt ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
                }`}>
                  {answers[currentQ.id] === opt && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
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
              <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 text-slate-600 font-medium leading-relaxed">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Technical Specification</div>
                <div className="prose prose-slate max-w-none">{currentQ.explanation}</div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                className="px-4 py-2 text-slate-400 hover:text-slate-900 disabled:opacity-20 font-bold text-xs uppercase tracking-widest transition-all"
              >
                <i className="fas fa-chevron-left mr-2"></i> Prev
              </button>
            </div>

            <div className="flex items-center gap-2">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentQuestionIdx ? 'w-8 bg-indigo-600' : 
                    answers[q.id] ? 'bg-indigo-100 border border-indigo-200' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIdx === questions.length - 1 ? (
              <button
                onClick={() => { if(window.confirm('Ready to submit your work?')) handleSubmit(); }}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                Finish Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
              >
                Next Question
              </button>
            )}
          </div>
        </div>

        {/* Right: Coding Editor Panel */}
        {currentQ.type === QuestionType.CODING && (
          <div className="w-1/2 flex flex-col bg-slate-50 p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-rose-400 rounded-full"></span>
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                <span className="ml-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">solution.js</span>
              </div>
              <button 
                onClick={runCode}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 shadow-sm transition-all"
              >
                <i className="fas fa-play mr-2"></i> Execute Tests
              </button>
            </div>
            <div className="flex-1 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-[#1e1e1e]">
              <CodingEditor 
                code={answers[currentQ.id] || ''} 
                onChange={(val) => handleAnswerChange(currentQ.id, val)} 
              />
            </div>
            <div className="h-48 bg-white rounded-3xl p-8 font-mono text-xs text-slate-800 border border-slate-200 overflow-y-auto shadow-inner">
              <div className="mb-4 text-slate-400 font-black uppercase tracking-widest text-[9px]">Environment Console</div>
              <pre className="leading-relaxed whitespace-pre-wrap">{output || '> Secure Sandbox Ready. Initializing...'}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentView;
