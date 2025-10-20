import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import axios from "axios";
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [NgIf, NgFor],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop {
  protected webError = signal<any>(null)
  protected webData = signal<ToyModel[]>([]);

  constructor(){
    ToyService.getAllToys()
      .then(data => this.webData.set(data))
      .catch(e => this.webError.set(e))
    }
}
