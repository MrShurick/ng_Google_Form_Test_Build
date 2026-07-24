import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreator } from './quiz-creator';

describe('QuizCreator', () => {
  let component: QuizCreator;
  let fixture: ComponentFixture<QuizCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCreator],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizCreator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
