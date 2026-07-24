import { isPlatformBrowser } from '@angular/common';
import { 
  Component, 
  OnInit, 
  inject, 
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import { 
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuizData } from '../../services/quiz-data';
import { Router } from '@angular/router';

const STORAGE_KEY = 'quiz_creator_data';

@Component({
  selector: 'app-quiz-creator',
  imports: [ReactiveFormsModule],
  templateUrl: './quiz-creator.html',
  styleUrl: './quiz-creator.scss',
})
export class QuizCreator implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {
    this.fb = inject(FormBuilder);
  }

  public sub!: Subscription;
  public fb!: FormBuilder;
  private router = inject(Router)
  private quizService = inject(QuizData);
  private platformId = inject(PLATFORM_ID);

  public tests: FormArray = new FormArray<any>([]);
  public deletingQuest = new Set<string>();
  public deletingAnswer = new Set<string>();
  public indexDeleteTest: number[] = [];


  public ngOnInit(): void {
    this.tests = this.fb.array([]);

    this.LoadFormLocal();

    this.tests.valueChanges.subscribe((value: any) => {
      this.saveToLocal(value);
    });

    this.cdr.markForCheck();

    this.sub = this.quizService.savedId$.subscribe((indexDelete: number) => {
      if (indexDelete === null) return;

      this.tests.removeAt(indexDelete);
      this.cdr.markForCheck();
    });
  }

  private saveToLocal(value: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.error(e)
    }
  }

  private LoadFormLocal(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.buildDefaultForm();
      return;
    }

    this.tests.clear();

    const saveData = localStorage.getItem(STORAGE_KEY);

    if (!saveData) {
      this.buildDefaultForm();
      return;
    }

    try {
      const parseTest = JSON.parse(saveData);

      if (Array.isArray(parseTest) && parseTest.length > 0) {
        parseTest.forEach((testData: any) => {
          const testGroup: FormGroup = this.createTest();
          const questArr = testGroup.get('questions') as FormArray;

          testData.questions?.forEach((questData: any) => {
            const questGroup: FormGroup = this.createQuestion();
            const answerArr = questGroup.get('answers') as FormArray;

            questData.answers?.forEach(() => {
              answerArr.push(this.createAnswer());
            });
            questArr.push(questGroup);
            questGroup.patchValue(questData);
          });
          testGroup.patchValue(testData);
          this.tests.push(testGroup);
        });
      } else {
        this.buildDefaultForm();
      }
    } catch (error) {
      console.error(error);
      this.buildDefaultForm();
    }
  }

  private buildDefaultForm(): void {
    this.tests.clear();
    this.addTest();
    this.addQuestion(0);
  }

  public createTest() {
    return this.fb.group({
      testIndex: [null],
      testName: [],
      questions: this.fb.array([]),
    });
  }

  public createQuestion() {
    return this.fb.group({
      questIndex: [],
      questText: ['', Validators.required],
      questType: ['singl'],
      answers: this.fb.array([]),
    });
  }

  public createAnswer() {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: false,
    });
  }

  public addTest(): void {
    const newTest = this.createTest();
    this.cdr.markForCheck();
    this.tests.push(newTest);
  }

  public addQuestion(testIn: number): void {
    const test = this.tests.at(testIn) as FormGroup;
    const questArr = test.get('questions') as FormArray;
    const newQuest = this.createQuestion();
    questArr.push(newQuest);
    this.cdr.markForCheck();
  }

  public addAnswer(testIndex: number, questIndex: number): void {
    const quest = this.getAnswerArray(questIndex, testIndex) as FormArray;
    const newAnswer = this.createAnswer();
    quest.push(newAnswer);
    this.cdr.markForCheck();
  }

  public deleteTest(testId: FormGroup): void {
    const index: number = this.tests.controls.indexOf(testId);
    this.indexDeleteTest.push(index);
    
    if (index !== -1) {
      setTimeout(() => {
        this.tests.removeAt(index);
        this.indexDeleteTest = this.indexDeleteTest.filter(ind => ind !== index);
        this.quizService.clearPreviewData();
        this.cdr.markForCheck();
      },550);
    }
  }

  public deleteQuestion(testIndex: number, questIndex: number): void {
    const key: string = `${testIndex} - ${questIndex}`;
    this.deletingQuest.add(key);

    setTimeout(() => {
      const questArr = this.getQuestionsArray(testIndex);
      questArr.removeAt(questIndex);
      this.deletingQuest.delete(key);
      this.cdr.markForCheck();
    },550);
  }

  public deleteAnswer(testIndex: number, questIndex: number, answerIndex: number): void {
    const key: string = `${questIndex} - ${answerIndex}`;
    this.deletingAnswer.add(key);

    setTimeout(() => {
      const answerArr = this.getAnswerArray(questIndex, testIndex);
      answerArr.removeAt(answerIndex);
      this.deletingAnswer.delete(key);
      this.cdr.markForCheck();
    },550);
  }

  public isQuestDelet(testIn: number, questIn: number): boolean {
    return this.deletingQuest.has(`${testIn} - ${questIn}`);
  }

  public isAnswerDelet(questIn: number, answerIndex: number): boolean {
    return this.deletingAnswer.has(`${questIn} - ${answerIndex}`);
  }

  public trueAnswer(testIn: number, questIn: number, answerIn: number): void {
    const arrAnswer = this.getAnswerArray(questIn, testIn);
    const answer = arrAnswer.at(answerIn) as FormGroup;
    const currentValue = answer.get('isCorrect')?.value;
    answer.patchValue({ 'isCorrect': !currentValue });
  }

  public getTestGroup(index: number): FormGroup {
    return this.tests.at(index) as FormGroup;
  }

  public getQuestionsArray(questIndex: number): FormArray {
    return this.getTestGroup(questIndex).get('questions') as FormArray;
  }

  public getAnswerArray(questIndex: number, testIndex: number): FormArray {
    const questArr = this.getQuestionsArray(testIndex);
    const currentQuest = questArr.at(questIndex) as FormGroup;
    return currentQuest.get('answers') as FormArray;
  }

  public onPreview(testIndex: number): void {
    const testGroup = this.getTestGroup(testIndex);
    testGroup.patchValue({ 'testIndex': testIndex });
    const test = this.getTestGroup(testIndex).getRawValue();
    this.quizService.setData(test);
    this.router.navigate(['/preview']);
  }
}