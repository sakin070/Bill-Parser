import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionCanvasComponent } from './selection-canvas.component';

describe('SelectionCanvasComponent', () => {
  let component: SelectionCanvasComponent;
  let fixture: ComponentFixture<SelectionCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
