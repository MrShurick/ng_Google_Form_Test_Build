import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizData {
  public previewTest$ = new BehaviorSubject<any>(null);
  public savedTest$ = new BehaviorSubject<any[]>([]);
  public savedId$ = new Subject<number>();

  public readonly previewData: Observable<any> = this.previewTest$.asObservable();

  public setData(testData: any): void {
    const copieData = structuredClone(testData);
    this.previewTest$.next(copieData);
  }

  public clearPreviewData(): void {
    this.previewTest$.next(null);
  }

  public saveData(index: number): void {
    const currentData = this.previewTest$.value;

    if (!currentData && index === null) return;

    const copieData = structuredClone(currentData);
    copieData.testIndex = crypto.randomUUID();
    const currentList = this.savedTest$.value;
    this.savedTest$.next([...currentList, copieData]);
    this.savedId$.next(index);
    this.clearPreviewData()
  }

  public deleteSaveData(testIn: number): void {
    const updatedList = this.savedTest$.value.filter(test => test.testIndex !== testIn);
    this.savedTest$.next(updatedList);
  }
}
