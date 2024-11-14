import {Component, OnInit} from '@angular/core';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import {RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute} from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
    imports: [
        LoadingIndicatorComponent,
        RouterLink,
        RouterOutlet,
        HeaderComponent,
        RouterLinkActive,
      NgIf
    ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  showHeader: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      console.log('Route data:', data);
      this.showHeader = data['showHeader'] !== false;
    });
    console.log(this.showHeader)
  }

  onActivate(event: any): void {
    if (event && event.showHeader !== undefined) {
      this.showHeader = event.showHeader;
    }
  }
}

