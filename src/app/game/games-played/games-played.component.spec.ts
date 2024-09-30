import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesPlayedComponent } from './games-played.component';

describe('GamesPlayedComponent', () => {
  let component: GamesPlayedComponent;
  let fixture: ComponentFixture<GamesPlayedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesPlayedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
