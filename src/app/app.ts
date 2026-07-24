import { Component} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { QuizList } from "./components/quiz-list/quiz-list";
import { QuizCreator } from "./components/quiz-creator/quiz-creator";
import { QuizPlayer } from "./components/quiz-player/quiz-player";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, QuizList, QuizCreator, QuizPlayer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
}
