import {Component, OnInit} from '@angular/core';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  ActivatedRoute,
  Router,
  NavigationEnd,
  ActivatedRouteSnapshot
} from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import {NgIf} from "@angular/common";
import {filter} from "rxjs";

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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateHeaderVisibility();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateHeaderVisibility();
    });
  }

  private updateHeaderVisibility(): void {
    let child = this.route.firstChild;
    while (child) {
      if (child.firstChild) {
        child = child.firstChild;
      } else if (child.snapshot.data && child.snapshot.data['showHeader'] !== undefined) {
        this.showHeader = child.snapshot.data['showHeader'];
        return;
      } else {
        child = null;
      }
    }
  }
}
