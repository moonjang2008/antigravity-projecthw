// Date utility helpers and calendar generator

const utils = {
  // Format Date to YYYY-MM-DD
  formatISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  // Format to Korean text: e.g. "2026년 06월 21일"
  formatKoreanDate(dateString) {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${y}년 ${m}월 ${d}일`;
  },

  // Calculate D-Day relative to today
  getDDayString(targetDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: 'D-Day', class: 'badge-today', days: 0 };
    } else if (diffDays === 1) {
      return { text: 'D-1', class: 'badge-tomorrow', days: 1 };
    } else if (diffDays > 1) {
      return { text: `D-${diffDays}`, class: 'badge-future', days: diffDays };
    } else {
      return { text: `D+${Math.abs(diffDays)}`, class: 'badge-overdue', days: diffDays };
    }
  },

  // Generate calendar grid for a given year and month
  // Month is 0-indexed (0 = Jan, 11 = Dec)
  getCalendarGrid(year, month) {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const grid = [];

    // 1. Padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      grid.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateString: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      });
    }

    // 2. Days of the current month
    for (let d = 1; d <= totalDays; d++) {
      grid.push({
        day: d,
        month: month,
        year: year,
        isCurrentMonth: true,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      });
    }

    // 3. Padding days from next month to complete 6 weeks (42 cells)
    const remainingCells = 42 - grid.length;
    for (let d = 1; d <= remainingCells; d++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      grid.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        dateString: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      });
    }

    return grid;
  },

  // Subject Colors mapping for UI representation
  getSubjectColor(subject) {
    const subjects = {
      '국어': '#ef4444',     // Red
      '수학': '#3b82f6',     // Blue
      '영어': '#10b981',     // Green
      '과학': '#8b5cf6',     // Purple
      '사회': '#f59e0b',     // Amber
      '역사': '#ec4899',     // Pink
      'korean': '#ef4444',
      'math': '#3b82f6',
      'english': '#10b981',
      'science': '#8b5cf6',
      'social': '#f59e0b',
      'history': '#ec4899'
    };
    const key = String(subject || '').toLowerCase().trim();
    return subjects[key] || '#64748b'; // Default Slate
  }
};

window.utils = utils;
