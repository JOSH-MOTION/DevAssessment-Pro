import { User, AuthState, UserRole } from '../types';
import { db } from './dbService';

class AuthService {
  private STORAGE_KEY = 'devassessment_auth';

  getAuthState(): AuthState {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { user: null, token: null };
    } catch {
      return { user: null, token: null };
    }
  }

  login(email: string, pass: string): User | null {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    // Note: In production, use bcrypt here. For demo, we just find the user.
    if (user) {
      const state: AuthState = { user, token: 'session-' + Math.random() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      return user;
    }
    return null;
  }

  register(name: string, email: string, role: UserRole, cohort?: string): User {
    const newUser: User = {
      id: 'st-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      cohort,
      testHistory: []
    };
    db.addUser(newUser);
    return newUser;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAdmin() {
    return this.getAuthState().user?.role === 'admin';
  }
}

export const auth = new AuthService();