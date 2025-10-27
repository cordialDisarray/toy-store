import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CartService } from './cart.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { ToyModel } from '../models/toy.model';


@Component({
  selector: 'app-cart',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['item', 'price'];
  dataSource = new MatTableDataSource<ToyModel>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.dataSource.data = this.cartService.getItems()
    this.dataSource.filterPredicate = (data: ToyModel, filter: string) =>
      data.name.toLowerCase().includes(filter) || data.description.toLowerCase().includes(filter)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue
  }
}
