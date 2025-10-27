import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import axios from "axios";

@Component({
  selector: 'app-home',
  imports: [MatCardModule,
    MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected webData = signal('')

  constructor() {
    axios.get('https://toy.pequla.com/api/toy')
      .then
      (rsp => {
        console.log(rsp.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }
}
