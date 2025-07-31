export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  baseImage: string;
  customizationOptions: {
    colors: string[];
    textures: string[];
    maxFontSize: number;
  };
}