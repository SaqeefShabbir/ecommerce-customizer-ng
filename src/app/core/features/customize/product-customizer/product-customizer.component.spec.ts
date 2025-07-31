import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCustomizerComponent } from './product-customizer.component';

describe('ProductCustomizerComponent', () => {
  let component: ProductCustomizerComponent;
  let fixture: ComponentFixture<ProductCustomizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCustomizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCustomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
