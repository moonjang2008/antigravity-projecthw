const STORAGE_PREFIX = 'school_manager_';

const storage = {
  // --- User Auth Storage ---
  getUsers() {
    try {
      const usersJson = localStorage.getItem(`${STORAGE_PREFIX}users`);
      return usersJson ? JSON.parse(usersJson) : {};
    } catch (e) {
      console.error('Failed to parse users from localStorage', e);
      return {};
    }
  },

  saveUser(userId, passwordHash) {
    const users = this.getUsers();
    users[userId.toLowerCase()] = {
      id: userId,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
  },

  userExists(userId) {
    const users = this.getUsers();
    return !!users[userId.toLowerCase()];
  },

  // --- Assignments Storage ---
  getAssignments(userId) {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}assignments_${userId.toLowerCase()}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse assignments', e);
      return [];
    }
  },

  saveAssignments(userId, assignments) {
    localStorage.setItem(
      `${STORAGE_PREFIX}assignments_${userId.toLowerCase()}`,
      JSON.stringify(assignments)
    );
  },

  addAssignment(userId, assignment) {
    const list = this.getAssignments(userId);
    const newAssignment = {
      id: 'assign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
      ...assignment
    };
    list.push(newAssignment);
    this.saveAssignments(userId, list);
    return newAssignment;
  },

  updateAssignment(userId, id, updatedData) {
    const list = this.getAssignments(userId);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData, updatedAt: new Date().toISOString() };
      this.saveAssignments(userId, list);
      return list[index];
    }
    return null;
  },

  deleteAssignment(userId, id) {
    let list = this.getAssignments(userId);
    list = list.filter(item => item.id !== id);
    this.saveAssignments(userId, list);
  },

  // --- Exams Storage ---
  getExams(userId) {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}exams_${userId.toLowerCase()}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse exams', e);
      return [];
    }
  },

  saveExams(userId, exams) {
    localStorage.setItem(
      `${STORAGE_PREFIX}exams_${userId.toLowerCase()}`,
      JSON.stringify(exams)
    );
  },

  addExam(userId, exam) {
    const list = this.getExams(userId);
    const newExam = {
      id: 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
      ...exam
    };
    list.push(newExam);
    this.saveExams(userId, list);
    return newExam;
  },

  updateExam(userId, id, updatedData) {
    const list = this.getExams(userId);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedData, updatedAt: new Date().toISOString() };
      this.saveExams(userId, list);
      return list[index];
    }
    return null;
  },

  deleteExam(userId, id) {
    let list = this.getExams(userId);
    list = list.filter(item => item.id !== id);
    this.saveExams(userId, list);
  },

  // --- Demo / Seed Data ---
  seedDemoData(userId) {
    const today = new Date();
    
    // Create helper to offset dates relative to today
    const offsetDate = (days) => {
      const d = new Date(today);
      d.setDate(today.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const demoAssignments = [
      {
        id: 'demo_a1',
        subject: 'Math',
        title: 'Calculus Problem Set 4',
        description: 'Complete questions 1 to 15 on limits and continuity. Show all work step-by-step.',
        dueDate: offsetDate(0), // Today
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_a2',
        subject: 'Science',
        title: 'Physics Lab Report: Pendulums',
        description: 'Write up the analysis section including calculations for gravity acceleration.',
        dueDate: offsetDate(2), // 2 days from now
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_a3',
        subject: 'English',
        title: 'Essay Outline: Macbeth Themes',
        description: 'Draft a 1-page outline exploring the theme of ambition in Macbeth Act I-III.',
        dueDate: offsetDate(4), // 4 days from now
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_a4',
        subject: 'History',
        title: 'Read Chapter 12 Notes',
        description: 'Review pages 240-265 regarding the Industrial Revolution and note key definitions.',
        dueDate: offsetDate(-1), // Due yesterday (Overdue!)
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_a5',
        subject: 'Math',
        title: 'Algebra Worksheet',
        description: 'Practice problems on quadratic formula and solving inequalities.',
        dueDate: offsetDate(7),
        completed: true, // Already completed
        createdAt: new Date().toISOString()
      }
    ];

    const demoExams = [
      {
        id: 'demo_e1',
        subject: 'Science',
        title: 'Biology Midterm',
        range: 'Chapters 4 to 8: Cell Division, Genetics, and DNA Replication.',
        date: offsetDate(1), // Tomorrow
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_e2',
        subject: 'History',
        title: 'World War I Quiz',
        range: 'Causes of WWI, major alliances, trench warfare, and the Treaty of Versailles.',
        date: offsetDate(3), // 3 days from now
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_e3',
        subject: 'Math',
        title: 'Trigonometry Test',
        range: 'Sine, Cosine, Tangent graphs, Pythagorean identities, and laws of sines/cosines.',
        date: offsetDate(8), // 8 days from now
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    this.saveAssignments(userId, demoAssignments);
    this.saveExams(userId, demoExams);
  }
};

window.storage = storage;
