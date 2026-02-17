
import { Question, QuestionType, Difficulty, Assessment } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  // SECTION A: HTML (10 Questions)
  {
    id: 'h1',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.EASY,
    questionText: 'Which HTML5 element is used to specify a footer for a document or section?',
    options: ['<bottom>', '<footer-info>', '<footer>', '<end>'],
    correctAnswer: '<footer>',
    explanation: 'The <footer> element defines a footer for a document or section.'
  },
  {
    id: 'h2',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.MEDIUM,
    questionText: 'What is the purpose of the <main> element?',
    options: ['To house navigation', 'To contain the unique content of the document', 'To define sidebars', 'To define headers'],
    correctAnswer: 'To contain the unique content of the document',
    explanation: 'The <main> tag specifies the main content of a document.'
  },
  {
    id: 'h3',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.EASY,
    questionText: 'Which attribute is used to provide an alternative text for an image?',
    options: ['title', 'caption', 'alt', 'src-text'],
    correctAnswer: 'alt',
    explanation: 'The alt attribute provides alternative information if an image cannot be displayed.'
  },
  {
    id: 'h4',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.MEDIUM,
    questionText: 'How do you specify a multi-line input field in a form?',
    options: ['<input type="multiline">', '<textarea>', '<text-area>', '<input type="textarea">'],
    correctAnswer: '<textarea>',
    explanation: 'The <textarea> element is used for multi-line user input.'
  },
  {
    id: 'h5',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.HARD,
    questionText: 'Which ARIA attribute defines the hierarchical level of an element within a structure?',
    options: ['aria-level', 'aria-posinset', 'aria-setsize', 'aria-valuenow'],
    correctAnswer: 'aria-level',
    explanation: 'aria-level is used for defining levels in trees or headings.'
  },
  {
    id: 'h6',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.MEDIUM,
    questionText: 'What does the <figure> tag define?',
    options: ['Code snippets only', 'A container for diagrams, photos, or code listings', 'A decorative border', 'Scientific calculations'],
    correctAnswer: 'A container for diagrams, photos, or code listings',
    explanation: 'The <figure> element marks up self-contained content.'
  },
  {
    id: 'h7',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.EASY,
    questionText: 'Which element is used to group related elements in a form?',
    options: ['<group>', '<section>', '<fieldset>', '<form-group>'],
    correctAnswer: '<fieldset>',
    explanation: '<fieldset> groups several controls within a web form.'
  },
  {
    id: 'h8',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.MEDIUM,
    questionText: 'Which tag is used to create a drop-down list?',
    options: ['<list>', '<dropdown>', '<select>', '<input type="list">'],
    correctAnswer: '<select>',
    explanation: 'The <select> element is used to create a drop-down list.'
  },
  {
    id: 'h9',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.HARD,
    questionText: 'What is the correct syntax for referring to an external style sheet?',
    options: ['<style src="mystyle.css">', '<link rel="stylesheet" href="mystyle.css">', '<stylesheet>mystyle.css</stylesheet>', '<link src="mystyle.css">'],
    correctAnswer: '<link rel="stylesheet" href="mystyle.css">',
    explanation: 'The <link> tag connects the document to external resources.'
  },
  {
    id: 'h10',
    type: QuestionType.MCQ,
    category: 'HTML',
    difficulty: Difficulty.MEDIUM,
    questionText: 'Which attribute defines that an input field must be filled out?',
    options: ['validate', 'required', 'placeholder', 'mandatory'],
    correctAnswer: 'required',
    explanation: 'The required attribute is a boolean attribute that specifies an input must be filled.'
  },

  // SECTION B: JavaScript (10 Questions)
  {
    id: 'js1',
    type: QuestionType.MCQ,
    category: 'JavaScript',
    difficulty: Difficulty.MEDIUM,
    questionText: 'What will be the output of: console.log(typeof NaN);',
    options: ['number', 'NaN', 'undefined', 'object'],
    correctAnswer: 'number',
    explanation: 'In JavaScript, NaN is technically a value of type "number".'
  },
  {
    id: 'js2',
    type: QuestionType.MCQ,
    category: 'JavaScript',
    difficulty: Difficulty.HARD,
    questionText: 'Which of the following is NOT a characteristic of closures?',
    options: ['They have access to outer function scope', 'They allow data encapsulation', 'They can lead to memory leaks if not handled', 'They can only access local variables'],
    correctAnswer: 'They can only access local variables',
    explanation: 'Closures have access to the outer function scope, even after the outer function has returned.'
  },
  {
    id: 'js3',
    type: QuestionType.MCQ,
    category: 'JavaScript',
    difficulty: Difficulty.MEDIUM,
    questionText: 'How do you handle multiple promises concurrently and wait for all to settle?',
    options: ['Promise.all()', 'Promise.race()', 'Promise.any()', 'Promise.settleAll()'],
    correctAnswer: 'Promise.all()',
    explanation: 'Promise.all() waits for all promises to resolve or any to reject.'
  },
  {
    id: 'js4',
    type: QuestionType.MCQ,
    category: 'JavaScript',
    difficulty: Difficulty.EASY,
    questionText: 'Which method adds one or more elements to the end of an array?',
    options: ['shift()', 'pop()', 'push()', 'unshift()'],
    correctAnswer: 'push()',
    explanation: 'push() adds elements to the end; unshift() adds to the start.'
  },
  {
    id: 'js5',
    type: QuestionType.MCQ,
    category: 'JavaScript',
    difficulty: Difficulty.MEDIUM,
    questionText: 'What is the purpose of "use strict" in JavaScript?',
    options: ['To enable modern features', 'To enforce stricter parsing and error handling', 'To speed up execution', 'To prevent external access'],
    correctAnswer: 'To enforce stricter parsing and error handling',
    explanation: 'Strict mode makes it easier to write "secure" JavaScript.'
  },

  // SECTION D: DSA (Theory)
  {
    id: 'd1',
    type: QuestionType.MCQ,
    category: 'DSA',
    difficulty: Difficulty.EASY,
    questionText: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 'O(log n)',
    explanation: 'A balanced BST halves the search space each step.'
  },
  {
    id: 'd2',
    type: QuestionType.MCQ,
    category: 'DSA',
    difficulty: Difficulty.MEDIUM,
    questionText: 'Which data structure follows the LIFO (Last-In-First-Out) principle?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    correctAnswer: 'Stack',
    explanation: 'Stacks use LIFO; Queues use FIFO.'
  },

  // 5 CODING CHALLENGES
  {
    id: 'c1',
    type: QuestionType.CODING,
    category: 'DSA',
    difficulty: Difficulty.EASY,
    questionText: 'Write a function `reverseString(str)` that reverses a string.',
    initialCode: 'function reverseString(str) {\n  // Your code here\n}',
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"' },
      { input: '"world"', expectedOutput: '"dlrow"' }
    ],
    explanation: 'Use split, reverse, and join methods or a loop.'
  }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'test-html-001',
    title: 'HTML Mastery Evaluation',
    duration: 15,
    assignedCohort: 'Gen 30',
    sections: [
      { title: 'Semantic HTML & Layout', weight: 100, questionIds: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10'] }
    ],
    totalMarks: 20
  },
  {
    id: 'test-js-001',
    title: 'JavaScript Core Concepts',
    duration: 25,
    assignedCohort: 'Gen 30',
    sections: [
      { title: 'Variables, Scope & Async', weight: 100, questionIds: ['js1', 'js2', 'js3', 'js4', 'js5'] }
    ],
    totalMarks: 10
  },
  {
    id: 'test-dsa-001',
    title: 'DSA Fundamentals',
    duration: 30,
    assignedCohort: 'Gen 30',
    sections: [
      { title: 'Logic & Complexity', weight: 40, questionIds: ['d1', 'd2'] },
      { title: 'Coding Implementation', weight: 60, questionIds: ['c1'] }
    ],
    totalMarks: 30
  },
  {
    id: 'test-full-001',
    title: 'Full Stack Engineering Final',
    duration: 60,
    assignedCohort: 'Gen 30',
    sections: [
      { title: 'HTML', weight: 20, questionIds: ['h1', 'h2', 'h3'] },
      { title: 'JS', weight: 30, questionIds: ['js1', 'js2', 'js3'] },
      { title: 'DSA', weight: 50, questionIds: ['d1', 'd2', 'c1'] }
    ],
    totalMarks: 100
  }
];
