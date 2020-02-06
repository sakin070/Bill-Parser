import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectorComponent } from './rector.component';

describe('RectorComponent', () => {
  let component: RectorComponent;
  let fixture: ComponentFixture<RectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
