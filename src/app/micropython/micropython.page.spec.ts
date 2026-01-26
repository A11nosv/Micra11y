import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicropythonPage } from './micropython.page';

describe('MicropythonPage', () => {
  let component: MicropythonPage;
  let fixture: ComponentFixture<MicropythonPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MicropythonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
