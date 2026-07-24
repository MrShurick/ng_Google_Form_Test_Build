import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { QuizData } from '../../services/quiz-data';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-quiz-list',
  imports: [AsyncPipe],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss',
})
export class QuizList {
  constructor(private cdr: ChangeDetectorRef) {}

  private quizService = inject(QuizData);

  public saveTests$ = this.quizService.savedTest$;

  private delTest = new Set<number>();

  public deleteTest(testIn: number): void {
    const key: number = testIn;
    this.delTest.add(key);

    setTimeout(() => {
      this.quizService.deleteSaveData(testIn);
      this.delTest.delete(key);
      this.cdr.markForCheck();
    }, 500)
  }

  public getDeleteTest(index: number): boolean {
    return this.delTest.has(index)
  }
}
