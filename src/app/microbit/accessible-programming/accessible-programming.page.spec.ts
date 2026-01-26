import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessibleProgrammingPage } from './accessible-programming.page';

describe('AccessibleProgrammingPage', () => {
  let component: AccessibleProgrammingPage;
  let fixture: ComponentFixture<AccessibleProgrammingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibleProgrammingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
