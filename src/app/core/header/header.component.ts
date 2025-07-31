import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button routerLink="/">
        <mat-icon>store</mat-icon>
      </button>
      <span>E-Commerce Customizer</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/customize">
        <mat-icon>build</mat-icon>
        Customize
      </button>
      <button mat-button routerLink="/cart">
        <mat-icon>shopping_cart</mat-icon>
        Cart
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent {}