// Global state variables
let currentUserId = null;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-indexed

// DOM Element Selectors
const DOM = {
  // Views
  authView: document.getElementById('auth-view'),
  dashboardView: document.getElementById('dashboard-view'),
  
  // Auth Controls
  tabLogin: document.getElementById('tab-login'),
  tabSignup: document.getElementById('tab-signup'),
  authErrorBanner: document.getElementById('auth-error-banner'),
  loginForm: document.getElementById('login-form'),
  signupForm: document.getElementById('signup-form'),
  loginId: document.getElementById('login-id'),
  loginPw: document.getElementById('login-pw'),
  signupId: document.getElementById('signup-id'),
  signupPw: document.getElementById('signup-pw'),
  signupPwConfirm: document.getElementById('signup-pw-confirm'),
  btnQuickDemo: document.getElementById('btn-quick-demo'),
  
  // Header Actions
  themeToggle: document.getElementById('theme-toggle'),
  sunIcon: document.getElementById('sun-icon'),
  moonIcon: document.getElementById('moon-icon'),
  userDisplayName: document.getElementById('user-display-name'),
  dashboardUserName: document.getElementById('dashboard-user-name'),
  btnLogout: document.getElementById('btn-logout'),
  
  // Sidebar Actions
  btnSeedData: document.getElementById('btn-seed-data'),
  navItems: document.querySelectorAll('.nav-item, .mobile-nav-item'),
  
  // Sub-Views
  subviewHome: document.getElementById('subview-home'),
  subviewCalendar: document.getElementById('subview-calendar'),
  subviewTasks: document.getElementById('subview-tasks'),
  
  // Home Stats & Lists
  statPendingAssignments: document.getElementById('stat-pending-assignments'),
  statUpcomingExams: document.getElementById('stat-upcoming-exams'),
  statCompletionRate: document.getElementById('stat-completion-rate'),
  todayTasksContainer: document.getElementById('today-tasks-container'),
  upcomingAssignmentsContainer: document.getElementById('upcoming-assignments-container'),
  upcomingExamsContainer: document.getElementById('upcoming-exams-container'),
  filterAssignmentSubject: document.getElementById('filter-assignment-subject'),
  todayDateBadge: document.getElementById('today-date-badge'),
  
  // Calendar elements
  btnPrevMonth: document.getElementById('btn-prev-month'),
  btnNextMonth: document.getElementById('btn-next-month'),
  calendarMonthYear: document.getElementById('calendar-month-year'),
  calendarDaysGrid: document.getElementById('calendar-days-grid'),
  
  // Manage Tasks elements
  btnAddAssignment: document.getElementById('btn-add-assignment'),
  btnAddExam: document.getElementById('btn-add-exam'),
  countAssignments: document.getElementById('count-assignments'),
  countExams: document.getElementById('count-exams'),
  manageAssignmentsContainer: document.getElementById('manage-assignments-container'),
  manageExamsContainer: document.getElementById('manage-exams-container'),
  
  // Modals
  assignmentModal: document.getElementById('assignment-modal'),
  assignmentForm: document.getElementById('assignment-form'),
  assignmentId: document.getElementById('assignment-id'),
  assignmentSubject: document.getElementById('assignment-subject'),
  assignmentTitle: document.getElementById('assignment-title'),
  assignmentDesc: document.getElementById('assignment-desc'),
  assignmentDue: document.getElementById('assignment-due'),
  assignmentValidationError: document.getElementById('assignment-validation-error'),
  assignmentModalTitle: document.getElementById('assignment-modal-title'),
  
  examModal: document.getElementById('exam-modal'),
  examForm: document.getElementById('exam-form'),
  examId: document.getElementById('exam-id'),
  examSubject: document.getElementById('exam-subject'),
  examTitle: document.getElementById('exam-title'),
  examRange: document.getElementById('exam-range'),
  examDate: document.getElementById('exam-date'),
  examValidationError: document.getElementById('exam-validation-error'),
  examModalTitle: document.getElementById('exam-modal-title'),
  
  dayDetailsModal: document.getElementById('day-details-modal'),
  dayDetailsTitle: document.getElementById('day-details-title'),
  dayDetailsSubtitle: document.getElementById('day-details-subtitle'),
  dayDetailsAssignments: document.getElementById('day-details-assignments'),
  dayDetailsExams: document.getElementById('day-details-exams')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkActiveSession();
  setupTheme();
});

// Setup Dark/Light Theme
function setupTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'dark') {
    DOM.sunIcon.classList.remove('hidden');
    DOM.moonIcon.classList.add('hidden');
  } else {
    DOM.sunIcon.classList.add('hidden');
    DOM.moonIcon.classList.remove('hidden');
  }
}

// Toggle Dark/Light Theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  if (newTheme === 'dark') {
    DOM.sunIcon.classList.remove('hidden');
    DOM.moonIcon.classList.add('hidden');
  } else {
    DOM.sunIcon.classList.add('hidden');
    DOM.moonIcon.classList.remove('hidden');
  }
}

// Check if user is logged in
function checkActiveSession() {
  const sessionUser = auth.getCurrentUser();
  if (sessionUser) {
    loginSuccess(sessionUser);
  } else {
    logoutSuccess();
  }
}

function loginSuccess(userId) {
  currentUserId = userId;
  DOM.userDisplayName.textContent = userId;
  DOM.dashboardUserName.textContent = userId;
  DOM.authView.classList.add('hidden');
  DOM.dashboardView.classList.remove('hidden');
  
  // Set today's date label
  DOM.todayDateBadge.textContent = utils.formatKoreanDate(utils.formatISODate(new Date()));
  
  // Reset date context
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  
  // Render views
  switchSubView('home');
}

function logoutSuccess() {
  currentUserId = null;
  auth.logout();
  DOM.dashboardView.classList.add('hidden');
  DOM.authView.classList.remove('hidden');
  
  // Clear forms
  DOM.loginForm.reset();
  DOM.signupForm.reset();
  DOM.authErrorBanner.classList.add('hidden');
}

// Handle SPA views routing
function switchSubView(targetViewId) {
  // Update nav UI active styles
  DOM.navItems.forEach(item => {
    if (item.getAttribute('data-target') === targetViewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle views
  DOM.subviewHome.classList.add('hidden');
  DOM.subviewCalendar.classList.add('hidden');
  DOM.subviewTasks.classList.add('hidden');

  if (targetViewId === 'home') {
    DOM.subviewHome.classList.remove('hidden');
    renderHomeView();
  } else if (targetViewId === 'calendar') {
    DOM.subviewCalendar.classList.remove('hidden');
    renderCalendar();
  } else if (targetViewId === 'tasks') {
    DOM.subviewTasks.classList.remove('hidden');
    renderTasksManagementView();
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Theme toggle
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // Tab switching (Login vs Signup)
  DOM.tabLogin.addEventListener('click', () => {
    DOM.tabLogin.classList.add('active');
    DOM.tabSignup.classList.remove('active');
    DOM.loginForm.classList.remove('hidden');
    DOM.signupForm.classList.add('hidden');
    DOM.authErrorBanner.classList.add('hidden');
  });

  DOM.tabSignup.addEventListener('click', () => {
    DOM.tabSignup.classList.add('active');
    DOM.tabLogin.classList.remove('active');
    DOM.signupForm.classList.remove('hidden');
    DOM.loginForm.classList.add('hidden');
    DOM.authErrorBanner.classList.add('hidden');
  });

  // Login Form Submission
  DOM.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = DOM.loginId.value;
    const pw = DOM.loginPw.value;
    
    // Auth Validation
    if (!id || !pw) {
      showAuthError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const result = await auth.login(id, pw);
    if (result.success) {
      loginSuccess(result.userId);
    } else {
      showAuthError(result.message);
    }
  });

  // Signup Form Submission
  DOM.signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = DOM.signupId.value;
    const pw = DOM.signupPw.value;
    const pwConfirm = DOM.signupPwConfirm.value;

    // Form Validations
    if (id.length < 4) {
      showAuthError('아이디는 최소 4자 이상이어야 합니다.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
      showAuthError('아이디는 영문, 숫자, 밑줄(_)만 포함 가능합니다.');
      return;
    }
    if (pw.length < 6) {
      showAuthError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (pw !== pwConfirm) {
      showAuthError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = await auth.signup(id, pw);
    if (result.success) {
      // Auto login or switch tab with success msg
      showAuthSuccess(result.message);
      DOM.signupForm.reset();
      DOM.tabLogin.click();
    } else {
      showAuthError(result.message);
    }
  });

  // Quick Demo account login
  DOM.btnQuickDemo.addEventListener('click', async () => {
    const demoId = 'DemoStudent';
    const demoPw = 'Demo1234!';
    
    // Create demo account if not exists
    if (!storage.userExists(demoId)) {
      const hash = await auth.hashPassword(demoPw);
      storage.saveUser(demoId, hash);
      storage.seedDemoData(demoId);
    }
    
    const result = await auth.login(demoId, demoPw);
    if (result.success) {
      loginSuccess(result.userId);
    }
  });

  // Logout button
  DOM.btnLogout.addEventListener('click', logoutSuccess);

  // Seed Data button
  DOM.btnSeedData.addEventListener('click', () => {
    if (confirm('예시 데이터를 불러오시겠습니까? 기존 과제와 시험 일정에 테스트용 샘플이 추가됩니다.')) {
      storage.seedDemoData(currentUserId);
      renderHomeView();
      renderTasksManagementView();
      renderCalendar();
    }
  });

  // Sidebar / Bottom Nav items click
  DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchSubView(target);
    });
  });

  // Home filtering
  DOM.filterAssignmentSubject.addEventListener('change', () => {
    renderUpcomingAssignments();
  });

  // Calendar navigators
  DOM.btnPrevMonth.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  DOM.btnNextMonth.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // Open modals
  DOM.btnAddAssignment.addEventListener('click', () => {
    openAssignmentModal();
  });

  DOM.btnAddExam.addEventListener('click', () => {
    openExamModal();
  });

  // Close modals
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal-overlay').classList.add('hidden');
    });
  });

  // Closing modals on clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // Submit Assignment Form
  DOM.assignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitAssignmentForm();
  });

  // Submit Exam Form
  DOM.examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitExamForm();
  });
}

function showAuthError(msg) {
  DOM.authErrorBanner.className = 'alert-banner error-banner';
  DOM.authErrorBanner.textContent = msg;
  DOM.authErrorBanner.classList.remove('hidden');
}

function showAuthSuccess(msg) {
  DOM.authErrorBanner.className = 'alert-banner success-banner';
  DOM.authErrorBanner.textContent = msg;
  DOM.authErrorBanner.classList.remove('hidden');
}

// ================= RENDER LOGIC: HOME VIEW =================
function renderHomeView() {
  renderHomeStats();
  renderTodayTasks();
  renderUpcomingAssignments();
  renderUpcomingExams();
}

function renderHomeStats() {
  const assignments = storage.getAssignments(currentUserId);
  const exams = storage.getExams(currentUserId);
  
  const pendingAssignments = assignments.filter(a => !a.completed).length;
  const pendingExams = exams.filter(e => !e.completed).length;
  
  const totalTasks = assignments.length + exams.length;
  const completedTasks = assignments.filter(a => a.completed).length + exams.filter(e => e.completed).length;
  
  const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  DOM.statPendingAssignments.textContent = `${pendingAssignments}개`;
  DOM.statUpcomingExams.textContent = `${pendingExams}개`;
  DOM.statCompletionRate.textContent = `${rate}%`;
}

function renderTodayTasks() {
  const todayStr = utils.formatISODate(new Date());
  const assignments = storage.getAssignments(currentUserId);
  const exams = storage.getExams(currentUserId);

  // Filters for items scheduled/due today
  const todayAssignments = assignments.filter(a => a.dueDate === todayStr);
  const todayExams = exams.filter(e => e.date === todayStr);

  DOM.todayTasksContainer.innerHTML = '';

  if (todayAssignments.length === 0 && todayExams.length === 0) {
    DOM.todayTasksContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>오늘 마감되는 과제와 시험 일정이 없습니다. 여유로운 하루를 보내세요! 🍀</p>
      </div>
    `;
    return;
  }

  // Render assignments due today
  todayAssignments.forEach(item => {
    DOM.todayTasksContainer.appendChild(createTaskCardElement(item, 'assignment'));
  });

  // Render exams scheduled today
  todayExams.forEach(item => {
    DOM.todayTasksContainer.appendChild(createTaskCardElement(item, 'exam'));
  });
}

function renderUpcomingAssignments() {
  const subjectFilter = DOM.filterAssignmentSubject.value;
  const assignments = storage.getAssignments(currentUserId);
  
  // Sort assignments by due date (ascending)
  let filtered = assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (subjectFilter !== 'all') {
    filtered = filtered.filter(a => a.subject.toLowerCase() === subjectFilter.toLowerCase() || (subjectFilter === 'Other' && !['math', 'science', 'english', 'history'].includes(a.subject.toLowerCase())));
  }

  DOM.upcomingAssignmentsContainer.innerHTML = '';

  if (filtered.length === 0) {
    DOM.upcomingAssignmentsContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <p>예정된 과제가 없습니다. 대단해요! 🎉</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    DOM.upcomingAssignmentsContainer.appendChild(createTaskCardElement(item, 'assignment'));
  });
}

function renderUpcomingExams() {
  const exams = storage.getExams(currentUserId);
  
  // Sort exams by date (ascending)
  const sorted = exams.sort((a, b) => new Date(a.date) - new Date(b.date));

  DOM.upcomingExamsContainer.innerHTML = '';

  if (sorted.length === 0) {
    DOM.upcomingExamsContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <p>등록된 시험 일정이 없습니다. 편안하게 준비해보세요! ☕</p>
      </div>
    `;
    return;
  }

  sorted.forEach(item => {
    DOM.upcomingExamsContainer.appendChild(createTaskCardElement(item, 'exam'));
  });
}

// Generate DOM task card element
function createTaskCardElement(item, type) {
  const card = document.createElement('div');
  card.className = `task-card ${item.completed ? 'completed' : ''} ${type === 'exam' ? 'exam-type' : ''}`;
  card.id = `card-${item.id}`;

  const isExam = type === 'exam';
  const itemDate = isExam ? item.date : item.dueDate;
  const dday = utils.getDDayString(itemDate);
  const color = utils.getSubjectColor(item.subject);

  card.innerHTML = `
    <div class="task-checkbox-wrapper">
      <input type="checkbox" class="task-checkbox" ${item.completed ? 'checked' : ''} aria-label="완료 여부 선택">
    </div>
    <div class="task-info">
      <div class="task-title-line">
        <span class="task-title">${item.title}</span>
        <span class="badge ${dday.class}">${dday.text}</span>
      </div>
      <p class="task-desc">${isExam ? ('범위: ' + item.range) : (item.description || '세부 설명 없음')}</p>
      <div class="task-meta">
        <span class="task-subject" style="background-color: ${color}">${item.subject}</span>
        <span>기한: ${utils.formatKoreanDate(itemDate)}</span>
      </div>
    </div>
    <div class="item-actions task-actions">
      <button class="btn-item-action edit" aria-label="수정">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      </button>
      <button class="btn-item-action delete" aria-label="삭제">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  `;

  // Attach status toggle listener
  card.querySelector('.task-checkbox').addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (isExam) {
      storage.updateExam(currentUserId, item.id, { completed: isChecked });
    } else {
      storage.updateAssignment(currentUserId, item.id, { completed: isChecked });
    }
    
    // Refresh lists
    renderHomeView();
    renderTasksManagementView();
    renderCalendar();
  });

  // Edit action
  card.querySelector('.edit').addEventListener('click', () => {
    if (isExam) {
      openExamModal(item);
    } else {
      openAssignmentModal(item);
    }
  });

  // Delete action
  card.querySelector('.delete').addEventListener('click', () => {
    const itemTypeName = isExam ? '시험' : '과제';
    if (confirm(`선택한 ${itemTypeName} [${item.title}] 일정을 영구적으로 삭제하시겠습니까?`)) {
      if (isExam) {
        storage.deleteExam(currentUserId, item.id);
      } else {
        storage.deleteAssignment(currentUserId, item.id);
      }
      renderHomeView();
      renderTasksManagementView();
      renderCalendar();
    }
  });

  return card;
}

// ================= RENDER LOGIC: CALENDAR VIEW =================
function renderCalendar() {
  DOM.calendarMonthYear.textContent = `${currentYear}년 ${currentMonth + 1}월`;
  DOM.calendarDaysGrid.innerHTML = '';

  const gridData = utils.getCalendarGrid(currentYear, currentMonth);
  const todayStr = utils.formatISODate(new Date());

  const assignments = storage.getAssignments(currentUserId);
  const exams = storage.getExams(currentUserId);

  gridData.forEach(cell => {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';
    
    if (!cell.isCurrentMonth) {
      dayCell.classList.add('other-month');
    }
    if (cell.dateString === todayStr) {
      dayCell.classList.add('today');
    }

    const dayNumOfWeek = new Date(cell.year, cell.month, cell.day).getDay();
    if (dayNumOfWeek === 0) dayCell.classList.add('sunday');
    if (dayNumOfWeek === 6) dayCell.classList.add('saturday');

    // Filter day's events
    const dayAssignments = assignments.filter(a => a.dueDate === cell.dateString);
    const dayExams = exams.filter(e => e.date === cell.dateString);

    let eventDotsHtml = '';
    dayAssignments.forEach(() => {
      eventDotsHtml += '<span class="event-dot assignment-dot"></span>';
    });
    dayExams.forEach(() => {
      eventDotsHtml += '<span class="event-dot exam-dot"></span>';
    });

    dayCell.innerHTML = `
      <span class="day-number">${cell.day}</span>
      <div class="day-events">
        ${eventDotsHtml}
      </div>
    `;

    // Click handler to open detailed daily list modal
    dayCell.addEventListener('click', () => {
      openDayDetailsModal(cell.dateString, dayAssignments, dayExams);
    });

    DOM.calendarDaysGrid.appendChild(dayCell);
  });
}

function openDayDetailsModal(dateString, dayAssignments, dayExams) {
  DOM.dayDetailsSubtitle.textContent = utils.formatKoreanDate(dateString);
  DOM.dayDetailsAssignments.innerHTML = '';
  DOM.dayDetailsExams.innerHTML = '';

  if (dayAssignments.length === 0) {
    DOM.dayDetailsAssignments.innerHTML = '<p class="field-hint">마감되는 과제가 없습니다.</p>';
  } else {
    dayAssignments.forEach(a => {
      const item = document.createElement('div');
      item.className = `day-details-item ${a.completed ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="day-details-item-left">
          <span class="task-subject" style="background-color: ${utils.getSubjectColor(a.subject)}">${a.subject}</span>
          <span class="day-details-item-title">${a.title}</span>
        </div>
        <span>${a.completed ? '완료됨' : '미완료'}</span>
      `;
      DOM.dayDetailsAssignments.appendChild(item);
    });
  }

  if (dayExams.length === 0) {
    DOM.dayDetailsExams.innerHTML = '<p class="field-hint">예정된 시험이 없습니다.</p>';
  } else {
    dayExams.forEach(e => {
      const item = document.createElement('div');
      item.className = `day-details-item ${e.completed ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="day-details-item-left">
          <span class="task-subject" style="background-color: #a855f7">시험</span>
          <span class="day-details-item-title">${e.subject} - ${e.title}</span>
        </div>
        <span>${e.completed ? '준비완료' : '대기중'}</span>
      `;
      DOM.dayDetailsExams.appendChild(item);
    });
  }

  DOM.dayDetailsModal.classList.remove('hidden');
}

// ================= RENDER LOGIC: TASKS MANAGEMENT =================
function renderTasksManagementView() {
  const assignments = storage.getAssignments(currentUserId);
  const exams = storage.getExams(currentUserId);

  DOM.countAssignments.textContent = assignments.length;
  DOM.countExams.textContent = exams.length;

  // Render Assignments Column
  DOM.manageAssignmentsContainer.innerHTML = '';
  if (assignments.length === 0) {
    DOM.manageAssignmentsContainer.innerHTML = `
      <div class="empty-state">
        <p>등록된 과제가 없습니다. 아래에서 새로운 과제를 등록해보세요!</p>
      </div>
    `;
  } else {
    // Sort by creation date or due date
    const sortedAssignments = assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    sortedAssignments.forEach(item => {
      DOM.manageAssignmentsContainer.appendChild(createManageItemCard(item, 'assignment'));
    });
  }

  // Render Exams Column
  DOM.manageExamsContainer.innerHTML = '';
  if (exams.length === 0) {
    DOM.manageExamsContainer.innerHTML = `
      <div class="empty-state">
        <p>등록된 시험 일정이 없습니다. 시험 계획을 추가해보세요!</p>
      </div>
    `;
  } else {
    const sortedExams = exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedExams.forEach(item => {
      DOM.manageExamsContainer.appendChild(createManageItemCard(item, 'exam'));
    });
  }
}

function createManageItemCard(item, type) {
  const card = document.createElement('div');
  card.className = `manage-item-card ${item.completed ? 'completed' : ''}`;
  
  const isExam = type === 'exam';
  const itemDate = isExam ? item.date : item.dueDate;
  const color = isExam ? '#a855f7' : utils.getSubjectColor(item.subject);

  card.innerHTML = `
    <div class="item-top">
      <div class="item-title-row">
        <span class="task-subject" style="background-color: ${color}">${item.subject}</span>
        <span class="item-title">${item.title}</span>
      </div>
      <div class="item-actions">
        <button class="btn-item-action edit" aria-label="수정">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button class="btn-item-action delete" aria-label="삭제">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
    <p class="item-desc">${isExam ? ('범위: ' + item.range) : (item.description || '설명 없음')}</p>
    <div class="item-bottom">
      <span>기한: ${utils.formatKoreanDate(itemDate)}</span>
      <span class="badge ${item.completed ? 'badge-future' : 'badge-today'}">${item.completed ? (isExam ? '준비완료' : '제출완료') : (isExam ? '시험대기' : '미제출')}</span>
    </div>
  `;

  // Edit action trigger
  card.querySelector('.edit').addEventListener('click', () => {
    if (isExam) {
      openExamModal(item);
    } else {
      openAssignmentModal(item);
    }
  });

  // Delete action trigger
  card.querySelector('.delete').addEventListener('click', () => {
    const itemTypeName = isExam ? '시험' : '과제';
    if (confirm(`선택한 ${itemTypeName} [${item.title}] 일정을 영구적으로 삭제하시겠습니까?`)) {
      if (isExam) {
        storage.deleteExam(currentUserId, item.id);
      } else {
        storage.deleteAssignment(currentUserId, item.id);
      }
      // Reload UI
      renderHomeView();
      renderTasksManagementView();
      renderCalendar();
    }
  });

  return card;
}

// ================= MODALS & FORMS LOGIC =================
function openAssignmentModal(existingData = null) {
  DOM.assignmentForm.reset();
  DOM.assignmentValidationError.classList.add('hidden');

  if (existingData) {
    DOM.assignmentModalTitle.textContent = '과제 수정';
    DOM.assignmentId.value = existingData.id;
    DOM.assignmentSubject.value = existingData.subject;
    DOM.assignmentTitle.value = existingData.title;
    DOM.assignmentDesc.value = existingData.description;
    DOM.assignmentDue.value = existingData.dueDate;
  } else {
    DOM.assignmentModalTitle.textContent = '새 과제 추가';
    DOM.assignmentId.value = '';
    // Set default due date as tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    DOM.assignmentDue.value = utils.formatISODate(tomorrow);
  }

  DOM.assignmentModal.classList.remove('hidden');
}

function submitAssignmentForm() {
  const id = DOM.assignmentId.value;
  const subject = DOM.assignmentSubject.value;
  const title = DOM.assignmentTitle.value.trim();
  const description = DOM.assignmentDesc.value.trim();
  const dueDate = DOM.assignmentDue.value;

  // Validation
  if (!subject) {
    showAssignmentFormError('과목을 선택해주세요.');
    return;
  }
  if (!title) {
    showAssignmentFormError('과제 제목을 입력해주세요.');
    return;
  }
  if (!dueDate) {
    showAssignmentFormError('마감 기한을 선택해주세요.');
    return;
  }

  const assignmentPayload = {
    subject,
    title,
    description,
    dueDate
  };

  if (id) {
    storage.updateAssignment(currentUserId, id, assignmentPayload);
  } else {
    storage.addAssignment(currentUserId, assignmentPayload);
  }

  DOM.assignmentModal.classList.add('hidden');
  renderHomeView();
  renderTasksManagementView();
  renderCalendar();
}

function showAssignmentFormError(msg) {
  DOM.assignmentValidationError.textContent = msg;
  DOM.assignmentValidationError.classList.remove('hidden');
}

function openExamModal(existingData = null) {
  DOM.examForm.reset();
  DOM.examValidationError.classList.add('hidden');

  if (existingData) {
    DOM.examModalTitle.textContent = '시험 일정 수정';
    DOM.examId.value = existingData.id;
    DOM.examSubject.value = existingData.subject;
    DOM.examTitle.value = existingData.title;
    DOM.examRange.value = existingData.range;
    DOM.examDate.value = existingData.date;
  } else {
    DOM.examModalTitle.textContent = '새 시험 일정 등록';
    DOM.examId.value = '';
    // Default exam date as 3 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    DOM.examDate.value = utils.formatISODate(defaultDate);
  }

  DOM.examModal.classList.remove('hidden');
}

function submitExamForm() {
  const id = DOM.examId.value;
  const subject = DOM.examSubject.value.trim();
  const title = DOM.examTitle.value.trim();
  const range = DOM.examRange.value.trim();
  const date = DOM.examDate.value;

  // Form validations
  if (!subject) {
    showExamFormError('시험 과목을 입력해주세요.');
    return;
  }
  if (!title) {
    showExamFormError('시험 제목을 입력해주세요.');
    return;
  }
  if (!range) {
    showExamFormError('시험 범위를 입력해주세요.');
    return;
  }
  if (!date) {
    showExamFormError('시험 일정을 선택해주세요.');
    return;
  }

  const examPayload = {
    subject,
    title,
    range,
    date
  };

  if (id) {
    storage.updateExam(currentUserId, id, examPayload);
  } else {
    storage.addExam(currentUserId, examPayload);
  }

  DOM.examModal.classList.add('hidden');
  renderHomeView();
  renderTasksManagementView();
  renderCalendar();
}

function showExamFormError(msg) {
  DOM.examValidationError.textContent = msg;
  DOM.examValidationError.classList.remove('hidden');
}
