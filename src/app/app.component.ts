import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BenchmarkComponent} from "./component/benchmark/benchmark.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BenchmarkComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  title = 'Web Worker Benchmark';

}
