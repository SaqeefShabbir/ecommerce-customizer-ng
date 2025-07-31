import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerComponent } from '../../../../shared/components/color-picker/color-picker.component';
import { TextureSelectorComponent } from '../../../../shared/components/texture-selector/texture-selector.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart.service'
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomToastComponent } from '../../../../shared/components/custom-toast-component/custom-toast-component.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-customizer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    ColorPickerComponent,
    TextureSelectorComponent,
    MatTooltipModule
],
  templateUrl: './product-customizer.component.html',
  styleUrls: ['./product-customizer.component.scss']
})
export class ProductCustomizerComponent implements OnInit {
  product: Product | undefined;
  selectedColor = '#3f51b5';
  selectedTexture = {
      id: 'matte',
      name: 'Matte Finish',
      thumbnail: '/assets/textures/matte.jpg',
      preview: '/assets/textures/matte.jpg',
      roughness: 0.9,
      metallic: 0.1
    };
  engravingText = '';
  fontSize = 16;
  rotation = 0;
  zoom = 1;

  customizationForm: FormGroup;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customizationForm = this.fb.group({
      engravingText: ['', Validators.maxLength(50)], 
      fontSize: [16], 
    });
  }

  ngOnInit(): void {
    this.productService.getProduct(2).subscribe(product => {
      this.product = product;
    });
  }

  getFormControl(controlName: string) {
    return this.customizationForm.get(controlName) as FormControl<string | number | null>;
  }

  addToCart(): void {
    if (this.product) {
      const customizedProduct = {
        ...this.product,
        customization: {
          color: this.selectedColor,
          texture: this.selectedTexture,
          engraving: this.customizationForm.value.engravingText,
          fontSize: this.customizationForm.value.fontSize
        }
      };
      
      this.cartService.addToCart(customizedProduct);
      this.toastr.show(
        'Operation Successful!',
        'Success',
        { toastComponent: CustomToastComponent },
        'success'
      );
    }
  }

  rotate(direction: 'left' | 'right'): void {
    this.rotation += direction === 'left' ? -15 : 15;
  }

  zoomInOut(amount: number): void {
    this.zoom = Math.max(0.5, Math.min(2, this.zoom + amount));
  }

  // In your component
  getTextureFilter(): string {
    const texture = this.selectedTexture;
    let filters = [
      `hue-rotate(${this.getHueRotation(this.selectedColor)}deg)`
    ];
    
    if (texture) {
      if (texture.roughness) {
        filters.push(`contrast(${1 + texture.roughness * 0.5})`);
      }
      if (texture.metallic) {
        filters.push(`brightness(${1 + texture.metallic * 0.3})`);
      }
    }
    
    return filters.join(' ');
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  /**
   * Converts a hex color to hue-rotate filter value
   * @param hexColor Hex color string (e.g., '#3f51b5')
   * @returns Hue rotation value in degrees
   */
  getHueRotation(hexColor: string): number {


    //Color Implementation
    if (!hexColor || !hexColor.startsWith('#')) return 0;
    
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;

    // Find max and min RGB values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    // Calculate hue
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    // Convert hue to degrees (0-360)
    const hueDegrees = Math.round(h * 360);
    
    // Calculate hue rotation needed to match target color
    // This is a simplified approach - for more accuracy you might need color library
    return hueDegrees;
  }
}