import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface Texture {
  id: string;
  name: string;
  thumbnail: string;
  preview: string;
  roughness?: number;
  metallic?: number;
}

@Component({
  selector: 'app-texture-selector',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatTooltipModule, MatIconModule, MatProgressBarModule],
  templateUrl: './texture-selector.component.html',
  styleUrls: ['./texture-selector.component.scss']
})
export class TextureSelectorComponent {
  @Input() selectedTexture: Texture | undefined;
  @Output() selectedTextureChange = new EventEmitter<Texture>();

  textures: Texture[] = [
    {
      id: 'matte',
      name: 'Matte Finish',
      thumbnail: '/assets/textures/matte.jpg',
      preview: '/assets/textures/matte.jpg',
      roughness: 0.9,
      metallic: 0.1
    },
    {
      id: 'glossy',
      name: 'Glossy Finish',
      thumbnail: '/assets/textures/glossy.jpg',
      preview: '/assets/textures/glossy.jpg',
      roughness: 0.1,
      metallic: 0.3
    },
    {
      id: 'metallic',
      name: 'Metallic Finish',
      thumbnail: '/assets/textures/metallic.jpg',
      preview: '/assets/textures/metallic.jpg',
      roughness: 0.4,
      metallic: 0.8
    },
    {
      id: 'wood',
      name: 'Wood Grain',
      thumbnail: '/assets/textures/wood.jpg',
      preview: '/assets/textures/wood.jpg',
      roughness: 0.7,
      metallic: 0.2
    },
    {
      id: 'carbon',
      name: 'Carbon Fiber',
      thumbnail: '/assets/textures/carbon.jpg',
      preview: '/assets/textures/carbon.jpg',
      roughness: 0.5,
      metallic: 0.6
    },
    {
      id: 'fabric',
      name: 'Fabric Texture',
      thumbnail: '/assets/textures/fabric.jpg',
      preview: '/assets/textures/fabric.jpg',
      roughness: 0.8,
      metallic: 0.0
    }
  ];

  selectTexture(textureId: string): void {
    this.selectedTexture = this.getTextureById(textureId);
    this.selectedTextureChange.emit(this.selectedTexture);
  }

  getTextureById(id: string): Texture | undefined {
    return this.textures.find(t => t.id === id);
  }
}