import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectParseComponent } from './direct-parse.component';

describe('DirectParseComponent', () => {
  let component: DirectParseComponent;
  let fixture: ComponentFixture<DirectParseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectParseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectParseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
