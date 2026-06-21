const auth = {
  // Helper to hash password using Web Crypto API SHA-256
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // Signup simulation
  async signup(userId, password) {
    userId = userId.trim();
    if (!userId || !password) {
      return { success: false, message: 'Please enter both ID and Password.' };
    }

    if (userId.length < 4) {
      return { success: false, message: 'Username must be at least 4 characters long.' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
      return { success: false, message: 'Username can only contain letters, numbers, and underscores.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (storage.userExists(userId)) {
      return { success: false, message: 'This ID is already taken. Please choose another.' };
    }

    try {
      const hash = await this.hashPassword(password);
      storage.saveUser(userId, hash);
      return { success: true, message: 'Signup successful! Please log in.' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'An error occurred during signup.' };
    }
  },

  // Login simulation
  async login(userId, password) {
    userId = userId.trim();
    if (!userId || !password) {
      return { success: false, message: 'Please enter both ID and Password.' };
    }

    const users = storage.getUsers();
    const user = users[userId.toLowerCase()];

    if (!user) {
      return { success: false, message: 'Account not found. Please sign up first.' };
    }

    try {
      const hash = await this.hashPassword(password);
      if (user.passwordHash === hash) {
        sessionStorage.setItem('currentUserId', user.id);
        return { success: true, userId: user.id };
      } else {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: 'An error occurred during login.' };
    }
  },

  getCurrentUser() {
    return sessionStorage.getItem('currentUserId') || null;
  },

  logout() {
    sessionStorage.removeItem('currentUserId');
  }
};

window.auth = auth;
