import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Shop } from './shop/shop';
import { Login } from './login/login';
import { Account } from './account/account';
import { Cart } from './cart/cart';
import { Toy } from './toy/toy';
import { Signup } from './signup/signup';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'shop', component: Shop},
    {path: 'login', component: Login},
    {path: 'account', component: Account},
    {path: 'signup', component: Signup},
    {path: 'cart', component: Cart},
    {path: 'toy', component: Toy},
];
