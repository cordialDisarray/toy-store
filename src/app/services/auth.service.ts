import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  favoriteTypes?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }

  private list(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  private saveList(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  signup(user: User): void {
    const users = this.list();
    if (users.some(u => u.email === user.email)) {
      throw new Error('User with this email already exists');
    }
    users.push(user);
    this.saveList(users);
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const u = this.list().find(x => x.email === email && x.password === password);
    if (!u) return false;
    this.currentUser.set(u);
    localStorage.setItem('currentUser', JSON.stringify(u));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  updateProfile(patch: Partial<User>): void {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, ...patch };
    const arr = this.list().map(u => u.email === user.email ? updated : u);
    this.saveList(arr);
    this.currentUser.set(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  getAllUsers(): User[] {
    return this.list();
  }
}
