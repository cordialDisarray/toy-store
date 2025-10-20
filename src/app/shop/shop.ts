import axios from 'axios' 
import { Component, ViewEncapsulation } from '@angular/core' 
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
    ReactiveFormsModule
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  encapsulation: ViewEncapsulation.None
})
export class Shop {
  types: TypeModel[] = [] 
  toys: ToyModel[] = [] 
  filteredToys: ToyModel[] = [] 

  showTypes = false 
  showAgeGroups = false

  typeControl = new FormControl<TypeModel[]>([]) 
  genderControl = new FormControl<string>('any') 
  ageGroupControl = new FormControl<string[]>([]) 

  constructor(private cartService: CartService, private cdr: ChangeDetectorRef) {
    this.loadTypes() 
    this.loadToys() 

    this.typeControl.valueChanges.subscribe(() => this.applyFilters())
    this.genderControl.valueChanges.subscribe(() => this.applyFilters())
    this.ageGroupControl.valueChanges.subscribe(() => this.applyFilters())
  }

  loadTypes() {
    axios.get('https://toy.pequla.com/api/type')
      .then(res => {
        this.types = res.data 
        this.cdr.detectChanges
      }) 
  }

  loadToys() {
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

    let result = this.toys.filter(toy => {
      const matchesType = selectedTypeIds.length === 0 || (toy.type && selectedTypeIds.includes(toy.type.typeId))
      const matchesGender = selectedGender === 'any' || toy.targetGroup === selectedGender 
      const matchesAge = selectedAges.length === 0 || (toy.ageGroup && selectedAges.includes(toy.ageGroup.name)) 
      return matchesType && matchesGender && matchesAge 
    })

    this.filteredToys = result
  }

  addToCart(toy: ToyModel) {
    this.cartService.addItem(toy) 
  }
}
