import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgIf, MatButtonModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account{
  auth = inject(AuthService);
  user = this.auth.currentUser;

  logout() {
    this.auth.logout();
  }
}
