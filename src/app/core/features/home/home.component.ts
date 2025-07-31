import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgxSkeletonLoaderModule,
    MatGridListModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  featuredProducts: Product[] = [];
  isLoading = true;
  currentSlide = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading = true;
    this.productService.getFeaturedProducts().subscribe({
      next: (products: any) => {
        this.featuredProducts = products;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredProducts.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.featuredProducts.length) % this.featuredProducts.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}