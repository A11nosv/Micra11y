import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManualCheckModalComponent } from './manual-check-modal.component';

describe('ManualCheckModalComponent', () => {
  let component: ManualCheckModalComponent;
  let fixture: ComponentFixture<ManualCheckModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ManualCheckModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
