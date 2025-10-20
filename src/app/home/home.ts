import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import axios from "axios";
import { ToyService } from '../../services/toy.service';
import { NgFor, NgIf } from '@angular/common';
import { ToyModel } from '../../models/toy.model';


@Component({
  selector: 'app-home',
  imports: [MatCardModule,
    MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
}
