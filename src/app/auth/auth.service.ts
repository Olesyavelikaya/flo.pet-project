import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, throwError} from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private url = 'https://fakestoreapi.com/auth/login';
public isAuthenticated = false;

  constructor(private http: HttpClient, private toast: ToastrService) { }

 public login(username: string, password: string) {
    const body = {username, password}
    return this.http.post(this.url, body).pipe(
      map(success => {
        if (success) {
          this.isAuthenticated = true;
        }
        return success
      }),
      catchError(error => {
        this.isAuthenticated = false;
        console.error(error);
        this.toast.error('Неправильный UserName или password', 'Error')
        throw error
      })
    )
  }

  isAuthentication(): boolean {
    return this.isAuthenticated
  }

}
