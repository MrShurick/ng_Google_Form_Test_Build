import { Routes } from '@angular/router';
import { QuizCreator } from './components/quiz-creator/quiz-creator';
import { QuizList } from './components/quiz-list/quiz-list';
import { QuizPlayer } from './components/quiz-player/quiz-player';

export const routes: Routes = [
    { path: 'save', component: QuizList },
    { path: '', component: QuizCreator },
    { path: 'preview', component: QuizPlayer },
    { path: '**', redirectTo: '' },
];
