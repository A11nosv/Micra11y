import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrobitPage } from './microbit.page';

describe('MicrobitPage', () => {
  let component: MicrobitPage;
  let fixture: ComponentFixture<MicrobitPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MicrobitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
