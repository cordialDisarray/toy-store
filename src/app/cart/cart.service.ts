import { Injectable } from '@angular/core';
import { ToyModel } from '../models/toy.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: ToyModel[] = [];

  constructor() {
    const saved = localStorage.getItem('cart')
    if(saved) {
      this.cartItems = JSON.parse(saved)
    }
  }

  addItem(item: ToyModel): void {
    this.cartItems.push(item);
    this.save()
  }

  getItems(): ToyModel[] {
    return this.cartItems;
  }

  clear(): void {
    this.cartItems = [];
    this.save()
  }

  private save() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems))
  }
}
