
import { User, Assessment, Submission, Question } from '../types';
import { INITIAL_QUESTIONS, MOCK_ASSESSMENTS } from '../constants';

const DB_KEYS = {
  USERS: 'devassessment_users',
  TESTS: 'devassessment_tests',
  SUBMISSIONS: 'devassessment_submissions',
  QUESTIONS: 'devassessment_questions',
};

class DBService {
  private init() {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem(DB_KEYS.QUESTIONS)) {
      localStorage.setItem(DB_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }
    if (!localStorage.getItem(DB_KEYS.TESTS)) {
      localStorage.setItem(DB_KEYS.TESTS, JSON.stringify(MOCK_ASSESSMENTS));
    }
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      const admin: User = {
        id: 'admin-1',
        name: 'Lead Instructor',
        email: 'admin@dev.pro',
        role: 'admin',
        testHistory: []
      };
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([admin]));
    }
    if (!localStorage.getItem(DB_KEYS.SUBMISSIONS)) {
      localStorage.setItem(DB_KEYS.SUBMISSIONS, JSON.stringify([]));
    }
  }

  constructor() {
    this.init();
  }

  private get<T>(key: string): T[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }
  private save<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers() { return this.get<User>(DB_KEYS.USERS); }
  getUser(id: string) { return this.getUsers().find(u => u.id === id); }
  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.save(DB_KEYS.USERS, users);
  }

  getTests() { return this.get<Assessment>(DB_KEYS.TESTS); }
  getTest(id: string) { return this.getTests().find(t => t.id === id); }
  saveTest(test: Assessment) {
    const tests = this.getTests();
    const idx = tests.findIndex(t => t.id === test.id);
    if (idx > -1) tests[idx] = test; else tests.push(test);
    this.save(DB_KEYS.TESTS, tests);
  }

  getQuestions() { return this.get<Question>(DB_KEYS.QUESTIONS); }
  getQuestion(id: string) { return this.getQuestions().find(q => q.id === id); }

  getSubmissions() { return this.get<Submission>(DB_KEYS.SUBMISSIONS); }
  getSubmission(id: string) { return this.getSubmissions().find(s => s.id === id); }
  saveSubmission(submission: Submission) {
    const subs = this.getSubmissions();
    subs.push(submission);
    this.save(DB_KEYS.SUBMISSIONS, subs);
    
    const users = this.getUsers();
    const user = users.find(u => u.id === submission.studentId);
    if (user) {
      user.testHistory.push(submission.id);
      this.save(DB_KEYS.USERS, users);
    }
  }
}

export const db = new DBService();
