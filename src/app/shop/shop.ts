import axios from 'axios'
import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSliderModule } from '@angular/material/slider'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio'
import { MatChipsModule } from '@angular/material/chips'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { ChangeDetectorRef } from '@angular/core'

import { ToyModel } from '../models/toy.model'
import { TypeModel } from '../models/type.model'
import { CartService } from '../cart/cart.service'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  selector: 'app-shop',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSelectModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatChipsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  encapsulation: ViewEncapsulation.None
})
export class Shop implements OnInit {
  types: TypeModel[] = []
  toys: ToyModel[] = []
  filteredToys: ToyModel[] = []

  showTypes = false
  showAgeGroups = false
  showPriceRange = false
  showGender = false

  typeControl = new FormControl<TypeModel[]>([])
  genderControl = new FormControl<string>('svi')
  ageGroupControl = new FormControl<string[]>([])
  minPriceControl = new FormControl<number | null>(null)
  maxPriceControl = new FormControl<number | null>(null)
  searchControl = new FormControl<string>('')
  sortControl = new FormControl<string>('name')
  sortDirectionControl = new FormControl<'rast' | 'opad'>('rast')

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadTypes()
    this.loadToys()

    this.typeControl.valueChanges.subscribe(() => this.applyFilters())
    this.genderControl.valueChanges.subscribe(() => this.applyFilters())
    this.ageGroupControl.valueChanges.subscribe(() => this.applyFilters())
    this.minPriceControl.valueChanges.subscribe(() => this.applyFilters())
    this.maxPriceControl.valueChanges.subscribe(() => this.applyFilters())
    this.searchControl.valueChanges.subscribe(() => this.applyFilters())
    this.sortControl.valueChanges.subscribe(() => this.applyFilters())
  }

  private loadTypes() {
    axios.get('https://toy.pequla.com/api/type')
      .then(res => {
        this.types = res.data
      })
  }

  private loadToys() {
    axios.get('https://toy.pequla.com/api/toy')
      .then(res => {
        this.toys = res.data.map((toy: ToyModel) => ({
          ...toy,
          imageUrl: `https://toy.pequla.com/img/${toy.toyId}.png`
        }))
        this.filteredToys = this.toys
        this.cdr.detectChanges()
      })
  }

  applyFilters() {
    const selectedTypes = this.typeControl.value || []
    const selectedTypeIds = selectedTypes.map(t => t.typeId)

    const selectedGender = this.genderControl.value
    const selectedAges = this.ageGroupControl.value || []

    const minPrice = this.minPriceControl.value
    const maxPrice = this.maxPriceControl.value

    const searchTerm = (this.searchControl.value || '').toLowerCase()

    let result = this.toys.filter(toy => {
      const matchesType = selectedTypeIds.length === 0 || (toy.type && selectedTypeIds.includes(toy.type.typeId))
      const matchesGender = selectedGender === 'svi' || toy.targetGroup === selectedGender
      const matchesAge = selectedAges.length === 0 || (toy.ageGroup && selectedAges.includes(toy.ageGroup.name))
      const matchesMinPrice = minPrice == null || toy.price >= minPrice
      const matchesMaxPrice = maxPrice == null || toy.price <= maxPrice
      const matchesSearch = toy.name.toLowerCase().includes(searchTerm)

      return matchesType && matchesGender && matchesAge && matchesMinPrice && matchesMaxPrice && matchesSearch
    })

    const sortItem = this.sortControl.value
    const sortDir = this.sortDirectionControl.value

    if (sortItem) {
      result.sort((a, b) => {
        console.log(a)
        console.log(b)
        const valA = this.getNestedValue(a, sortItem)
        const valB = this.getNestedValue(b, sortItem)
        console.log(valA)
        console.log(valB)

        if (valA < valB) return sortDir === 'rast' ? -1 : 1
        if (valA > valB) return sortDir === 'rast' ? 1 : -1

        return 0
      })

      this.filteredToys = result
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  toggleSortDirection() {
    const current = this.sortDirectionControl.value
    this.sortDirectionControl.setValue(current === 'rast' ? 'opad' : 'rast')
    this.applyFilters()
  }

  resetFilters() {
    this.typeControl.setValue([])
    this.genderControl.setValue('svi')
    this.ageGroupControl.setValue([])
    this.minPriceControl.setValue(null)
    this.maxPriceControl.setValue(null)

    this.filteredToys = this.toys
  }

  addToCart(toy: ToyModel) {
    this.cartService.addItem(toy)
    this.snackBar.open(`${toy.name} added to cart!`, 'Close', {
      duration: 2500,
      horizontalPosition: 'left',
      verticalPosition: 'bottom'
    })
  }
}
