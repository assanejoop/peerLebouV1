import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportinutesComponent } from './opportinutes.component';

describe('OpportinutesComponent', () => {
  let component: OpportinutesComponent;
  let fixture: ComponentFixture<OpportinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportinutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
