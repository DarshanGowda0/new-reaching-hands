import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetails1Component } from './item-details1.component';

describe('ItemDetails1Component', () => {
  let component: ItemDetails1Component;
  let fixture: ComponentFixture<ItemDetails1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetails1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetails1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
