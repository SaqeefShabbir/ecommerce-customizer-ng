import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary" class="footer">
      <span>© 2025 E-Commerce Customizer</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer {
      position: relative;
      bottom: 0;
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
    }
  `]
})
export class FooterComponent {}