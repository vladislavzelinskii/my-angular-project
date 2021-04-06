import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCardsComponent } from './bank-cards.component';

describe('BankCardsComponent', () => {
  let component: BankCardsComponent;
  let fixture: ComponentFixture<BankCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
