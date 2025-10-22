import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  favoriteTypes?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // logged user signal (null if not logged)
  currentUser = signal<User | null>(null);

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }

  signup(user: User): void {
  const users = this.getAllUsers();
  if (users.some(u => u.email === user.email)) {
    throw new Error('User with this email already exists');
  }
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  // log in immediately
  this.currentUser.set(user);
  localStorage.setItem('currentUser', JSON.stringify(user));
}

isLoggedIn(): boolean {
  return !!this.currentUser();
}
  login(email: string, password: string): boolean {
    const users = this.getAllUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return false;
    this.currentUser.set(found);
    localStorage.setItem('currentUser', JSON.stringify(found));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  updateProfile(data: Partial<User>): void {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, ...data };
    const users = this.getAllUsers().map(u => 
      u.email === user.email ? updated : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    this.currentUser.set(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  }

}
