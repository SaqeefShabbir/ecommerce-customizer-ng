import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'api/products'; // Replace with your actual API endpoint

  // Mock data for demonstration
  private mockFeaturedProducts: Product[] = [
    {
      id: 1,
      name: 'Customizable Smartphone Case',
      description: 'Personalize your phone case with unique designs and colors',
      shortDescription: 'Design your perfect phone case',
      price: 29.99,
      imageUrl: '/assets/images/phone-case.jpg',
      baseImage: '/assets/images/phone-case.jpg',
      customizationOptions: {
        colors: ['#3f51b5', '#673ab7', '#e91e63', '#00bcd4'],
        textures: ['matte', 'glossy', 'metallic'],
        maxFontSize: 24
      }
    },
    {
      id: 2,
      name: 'Personalized Coffee Mug',
      description: 'Create your own custom coffee mug with text and images',
      shortDescription: 'Brew happiness with your custom mug',
      price: 19.99,
      imageUrl: '/assets/images/coffee-mug.jpg',
      baseImage: '/assets/images/coffee-mug.jpg',
      customizationOptions: {
        colors: ['#ffffff', '#000000', '#f44336', '#4caf50'],
        textures: ['ceramic', 'matte', 'glossy'],
        maxFontSize: 36
      }
    },
    {
      id: 3,
      name: 'Engraved Wooden Watch',
      description: 'Elegant wooden watch with custom engraving options',
      shortDescription: 'Timeless style with personal touch',
      price: 89.99,
      imageUrl: '/assets/images/wooden-watch.jpg',
      baseImage: '/assets/images/wooden-watch.jpg',
      customizationOptions: {
        colors: ['#795548', '#5d4037', '#3e2723'],
        textures: ['wood-grain', 'smooth'],
        maxFontSize: 18
      }
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Get a single product by ID
   * @param id Product ID
   */
  getProduct(id: number): Observable<Product> {
    // In a real app, you would use:
    // return this.http.get<Product>(`${this.apiUrl}/${id}`);
    
    // Mock implementation for demo:
    const product = this.mockFeaturedProducts.find(p => p.id === id);
    return of(product ? {...product} : this.mockFeaturedProducts[0]).pipe(delay(500));
  }

  /**
   * Get featured products for the home page
   */
  getFeaturedProducts(): Observable<Product[]> {
    // In a real app, you would use:
    // return this.http.get<Product[]>(`${this.apiUrl}/featured`);
    
    // Mock implementation for demo:
    return of([...this.mockFeaturedProducts]).pipe(delay(800));
  }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    // return this.http.get<Product[]>(this.apiUrl);
    return of([...this.mockFeaturedProducts]).pipe(delay(1000));
  }

  /**
   * Search products by name or description
   * @param term Search term
   */
  searchProducts(term: string): Observable<Product[]> {
    if (!term.trim()) {
      return of([]);
    }
    // return this.http.get<Product[]>(`${this.apiUrl}/?q=${term}`);
    return of(
      this.mockFeaturedProducts.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) || 
        p.description.toLowerCase().includes(term.toLowerCase())
      )
    ).pipe(delay(300));
  }
}