import { Component } from '@angular/core';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    RouterLink,
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
