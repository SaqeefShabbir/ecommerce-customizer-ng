import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatIconModule],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() selectedColor: string = '';
  @Output() selectedColorChange = new EventEmitter<string>();

  colors = [
    '#3f51b5', '#673ab7', '#9c27b0', '#e91e63',
    '#f44336', '#ff5722', '#ff9800', '#ffc107',
    '#4caf50', '#009688', '#00bcd4', '#2196f3',
    '#607d8b', '#795548', '#000000', '#ffffff'
  ];

  selectColor(color: string): void {
    this.selectedColor = color;
    this.selectedColorChange.emit(color);
  }
}