import { Component, inject } from '@angular/core';
import { QuizData } from '../../services/quiz-data';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-player',
  imports: [AsyncPipe],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.scss',
})
export class QuizPlayer {
  private quizService = inject(QuizData);
  private router = inject(Router);
  public testData$ = this.quizService.previewData;

  public backEdite(): void {
    this.quizService.clearPreviewData();
    this.router.navigate(['/']);
  }

  public saveTest(): void {
    const index: number = this.quizService.previewTest$.value?.testIndex;
    this.quizService.saveData(index);
    this.quizService.clearPreviewData();
    this.router.navigate(['/save']);
  }
}
