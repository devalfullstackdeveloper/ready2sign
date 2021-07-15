import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawThankYouComponent } from './withdraw-thank-you.component';

describe('WithdrawThankYouComponent', () => {
  let component: WithdrawThankYouComponent;
  let fixture: ComponentFixture<WithdrawThankYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawThankYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawThankYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
