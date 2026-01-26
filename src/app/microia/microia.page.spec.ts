import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroiaPage } from './microia.page';

describe('MicroiaPage', () => {
  let component: MicroiaPage;
  let fixture: ComponentFixture<MicroiaPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MicroiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
