import { Component } from '@angular/core';
import {LoadingIndicatorComponent} from "../loading-indicator/loading-indicator.component";
import {RouterLink, RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LoadingIndicatorComponent, RouterLink, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
