import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsPComponent } from './item-details-p.component';

describe('ItemDetailsPComponent', () => {
  let component: ItemDetailsPComponent;
  let fixture: ComponentFixture<ItemDetailsPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailsPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
