import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextureSelectorComponent } from './texture-selector.component';

describe('TextureSelectorComponent', () => {
  let component: TextureSelectorComponent;
  let fixture: ComponentFixture<TextureSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextureSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextureSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
