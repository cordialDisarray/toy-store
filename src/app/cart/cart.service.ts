import { Injectable } from '@angular/core';
import { ToyModel } from '../models/toy.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: ToyModel[] = [];

  addItem(item: ToyModel): void {
    this.cartItems.push(item);
  }

  getItems(): ToyModel[] {
    return this.cartItems;
  }

  clear(): void {
    this.cartItems = [];
  }
}
