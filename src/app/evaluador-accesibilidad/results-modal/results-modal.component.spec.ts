import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultsModalComponent } from './results-modal.component';

describe('ResultsModalComponent', () => {
  let component: ResultsModalComponent;
  let fixture: ComponentFixture<ResultsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ResultsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
